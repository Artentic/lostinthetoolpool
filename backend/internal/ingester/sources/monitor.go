package sources

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// Monitor checks sources for updates and triggers fetches when data changes.
type Monitor struct {
	client  *http.Client
	sources []*Source
}

func NewMonitor(sources []*Source) *Monitor {
	return &Monitor{
		client: &http.Client{
			Timeout: 30 * time.Second,
			// Don't follow redirects for HEAD checks
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				if len(via) >= 3 {
					return fmt.Errorf("too many redirects")
				}
				return nil
			},
		},
		sources: sources,
	}
}

// CheckResult describes what the monitor found for a source.
type CheckResult struct {
	Source     *Source
	Changed   bool
	Error     error
	Duration  time.Duration
	NewETag   string
	NewHash   string
	Modified  time.Time
}

// CheckAll checks all enabled sources that are due for a check.
func (m *Monitor) CheckAll(ctx context.Context) []CheckResult {
	var results []CheckResult

	for _, src := range m.sources {
		if !src.NeedsCheck() {
			continue
		}

		start := time.Now()
		result := m.check(ctx, src)
		result.Duration = time.Since(start)

		src.LastChecked = time.Now()
		if result.Error != nil {
			src.ErrorCount++
			src.LastError = result.Error.Error()
			log.Printf("CHECK FAIL [%s] %s: %v", src.ID, src.Name, result.Error)
		} else {
			src.ErrorCount = 0
			src.LastError = ""
			if result.Changed {
				log.Printf("CHECK CHANGED [%s] %s (%.0fms)", src.ID, src.Name, result.Duration.Seconds()*1000)
			}
		}

		results = append(results, result)
	}

	return results
}

func (m *Monitor) check(ctx context.Context, src *Source) CheckResult {
	switch src.CheckMethod {
	case CheckHTTPHead:
		return m.checkHTTPHead(ctx, src)
	case CheckHTTPGet:
		return m.checkHTTPGet(ctx, src)
	case CheckScheduled:
		return CheckResult{Source: src, Changed: src.NeedsFetch()}
	default:
		return CheckResult{Source: src, Changed: src.NeedsFetch()}
	}
}

// checkHTTPHead uses HEAD request to detect changes via Last-Modified or ETag.
// Cheapest check — no data transfer, just headers.
func (m *Monitor) checkHTTPHead(ctx context.Context, src *Source) CheckResult {
	url := src.CheckURL
	if url == "" {
		url = src.URL
	}

	req, err := http.NewRequestWithContext(ctx, "HEAD", url, nil)
	if err != nil {
		return CheckResult{Source: src, Error: err}
	}
	req.Header.Set("User-Agent", "LostInTheToolPool/1.0 (product-catalog-updater)")

	// Send If-Modified-Since if we have a last modified time
	if !src.LastModified.IsZero() {
		req.Header.Set("If-Modified-Since", src.LastModified.UTC().Format(http.TimeFormat))
	}
	// Send If-None-Match if we have an ETag
	if src.LastETag != "" {
		req.Header.Set("If-None-Match", src.LastETag)
	}

	resp, err := m.client.Do(req)
	if err != nil {
		return CheckResult{Source: src, Error: fmt.Errorf("HEAD %s: %w", url, err)}
	}
	resp.Body.Close()

	src.LastStatus = resp.StatusCode

	// 304 Not Modified — no change
	if resp.StatusCode == http.StatusNotModified {
		return CheckResult{Source: src, Changed: false}
	}

	if resp.StatusCode >= 400 {
		return CheckResult{Source: src, Error: fmt.Errorf("HEAD %s: status %d", url, resp.StatusCode)}
	}

	result := CheckResult{Source: src}

	// Check ETag
	newETag := resp.Header.Get("ETag")
	if newETag != "" && newETag != src.LastETag {
		result.Changed = true
		result.NewETag = newETag
	}

	// Check Last-Modified
	if lm := resp.Header.Get("Last-Modified"); lm != "" {
		if t, err := http.ParseTime(lm); err == nil {
			if t.After(src.LastModified) {
				result.Changed = true
				result.Modified = t
			}
		}
	}

	// If no ETag or Last-Modified, we can't tell — assume changed if due for fetch
	if newETag == "" && resp.Header.Get("Last-Modified") == "" {
		result.Changed = src.NeedsFetch()
	}

	return result
}

// checkHTTPGet fetches the full content and compares SHA256 hash.
// More expensive but works for sources without ETag/Last-Modified.
func (m *Monitor) checkHTTPGet(ctx context.Context, src *Source) CheckResult {
	url := src.CheckURL
	if url == "" {
		url = src.URL
	}

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return CheckResult{Source: src, Error: err}
	}
	req.Header.Set("User-Agent", "LostInTheToolPool/1.0 (product-catalog-updater)")

	resp, err := m.client.Do(req)
	if err != nil {
		return CheckResult{Source: src, Error: fmt.Errorf("GET %s: %w", url, err)}
	}
	defer resp.Body.Close()

	src.LastStatus = resp.StatusCode

	if resp.StatusCode >= 400 {
		return CheckResult{Source: src, Error: fmt.Errorf("GET %s: status %d", url, resp.StatusCode)}
	}

	// Hash the content
	hasher := sha256.New()
	if _, err := io.Copy(hasher, resp.Body); err != nil {
		return CheckResult{Source: src, Error: fmt.Errorf("hash %s: %w", url, err)}
	}

	newHash := hex.EncodeToString(hasher.Sum(nil))
	changed := newHash != src.LastHash

	return CheckResult{
		Source:  src,
		Changed: changed,
		NewHash: newHash,
	}
}

// SourcesDueForFetch returns sources that have changed or are due for a full refresh.
func (m *Monitor) SourcesDueForFetch(results []CheckResult) []*Source {
	var due []*Source
	for _, r := range results {
		if r.Changed && r.Error == nil {
			// Update tracking state
			if r.NewETag != "" {
				r.Source.LastETag = r.NewETag
			}
			if !r.Modified.IsZero() {
				r.Source.LastModified = r.Modified
			}
			if r.NewHash != "" {
				r.Source.LastHash = r.NewHash
			}
			due = append(due, r.Source)
		}
	}

	// Also include sources that need a scheduled full fetch
	for _, src := range m.sources {
		if src.NeedsFetch() {
			alreadyDue := false
			for _, d := range due {
				if d.ID == src.ID {
					alreadyDue = true
					break
				}
			}
			if !alreadyDue {
				due = append(due, src)
			}
		}
	}

	return due
}
