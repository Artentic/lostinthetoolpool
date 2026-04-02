package sources

import "time"

// SourceType defines how we get data from this source.
type SourceType string

const (
	SourceAPI      SourceType = "api"      // REST/JSON API (Amazon PA-API, etc.)
	SourceFeed     SourceType = "feed"     // Affiliate datafeed (CSV/XML from Impact, ShareASale)
	SourceScrape   SourceType = "scrape"   // HTML scraping (product pages, category pages)
	SourcePDF      SourceType = "pdf"      // Manufacturer PDF catalog
	SourceManual   SourceType = "manual"   // Hand-entered data
)

// CheckMethod defines how we detect changes.
type CheckMethod string

const (
	CheckHTTPHead  CheckMethod = "http_head"  // HEAD request, compare Last-Modified / ETag
	CheckHTTPGet   CheckMethod = "http_get"   // GET request, compare content hash
	CheckAPICall   CheckMethod = "api_call"   // Call API endpoint for update timestamp
	CheckScheduled CheckMethod = "scheduled"  // Just run on schedule, no change detection
)

// Source represents a single data source for product information.
type Source struct {
	ID             string      `json:"id"`
	Name           string      `json:"name"`
	Brand          string      `json:"brand"`           // "Milwaukee", "DeWalt", "" for multi-brand
	Retailer       string      `json:"retailer"`        // "homedepot", "amazon", "" for manufacturer
	Type           SourceType  `json:"type"`
	URL            string      `json:"url"`             // Primary URL or API endpoint
	CheckMethod    CheckMethod `json:"check_method"`
	CheckURL       string      `json:"check_url"`       // URL to check for updates (may differ from data URL)
	CheckInterval  Duration    `json:"check_interval"`  // How often to check for changes
	FetchInterval  Duration    `json:"fetch_interval"`  // How often to do a full fetch regardless
	Priority       int         `json:"priority"`        // Higher = more authoritative (manufacturer > retailer)
	Ecosystem      string      `json:"ecosystem"`       // If source is ecosystem-specific
	Categories     []string    `json:"categories"`      // Which product categories this covers
	Country        string      `json:"country"`         // "US", "UK", "DE", etc.
	AffiliateID    string      `json:"affiliate_id"`    // Our affiliate tracking ID for this source
	Enabled        bool        `json:"enabled"`
	Notes          string      `json:"notes"`

	// Runtime state (not persisted in registry, tracked in monitoring)
	LastChecked    time.Time   `json:"last_checked"`
	LastModified   time.Time   `json:"last_modified"`
	LastFetched    time.Time   `json:"last_fetched"`
	LastETag       string      `json:"last_etag"`
	LastHash       string      `json:"last_hash"`       // SHA256 of last fetched content
	LastStatus     int         `json:"last_status"`     // HTTP status code
	LastError      string      `json:"last_error"`
	ProductCount   int         `json:"product_count"`   // Products from this source
	ErrorCount     int         `json:"error_count"`     // Consecutive errors
}

// Duration wraps time.Duration for JSON marshaling.
type Duration struct {
	time.Duration
}

func (d Duration) MarshalJSON() ([]byte, error) {
	return []byte(`"` + d.String() + `"`), nil
}

func (d *Duration) UnmarshalJSON(b []byte) error {
	s := string(b)
	if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
		s = s[1 : len(s)-1]
	}
	dur, err := time.ParseDuration(s)
	if err != nil {
		return err
	}
	d.Duration = dur
	return nil
}

// NeedsCheck returns true if it's time to check this source for updates.
func (s *Source) NeedsCheck() bool {
	if !s.Enabled {
		return false
	}
	if s.LastChecked.IsZero() {
		return true
	}
	return time.Since(s.LastChecked) >= s.CheckInterval.Duration
}

// NeedsFetch returns true if it's time for a full data fetch.
func (s *Source) NeedsFetch() bool {
	if !s.Enabled {
		return false
	}
	if s.LastFetched.IsZero() {
		return true
	}
	return time.Since(s.LastFetched) >= s.FetchInterval.Duration
}

// IsHealthy returns true if the source is responding without errors.
func (s *Source) IsHealthy() bool {
	return s.ErrorCount < 3 && s.LastStatus >= 200 && s.LastStatus < 400
}
