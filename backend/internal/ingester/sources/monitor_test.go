package sources

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestCheckHTTPHead304(t *testing.T) {
	// Server returns 304 Not Modified
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "HEAD" {
			t.Errorf("expected HEAD, got %s", r.Method)
		}
		w.WriteHeader(http.StatusNotModified)
	}))
	defer server.Close()

	src := &Source{
		ID:            "test",
		Enabled:       true,
		CheckMethod:   CheckHTTPHead,
		URL:           server.URL,
		CheckInterval: Duration{1 * time.Hour},
		LastModified:  time.Now().Add(-1 * time.Hour),
	}

	m := NewMonitor([]*Source{src})
	result := m.checkHTTPHead(context.Background(), src)

	if result.Changed {
		t.Error("expected no change for 304")
	}
	if result.Error != nil {
		t.Errorf("unexpected error: %v", result.Error)
	}
}

func TestCheckHTTPHeadNewETag(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("ETag", `"new-etag-123"`)
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	src := &Source{
		ID:          "test",
		Enabled:     true,
		CheckMethod: CheckHTTPHead,
		URL:         server.URL,
		LastETag:    `"old-etag-456"`,
	}

	m := NewMonitor([]*Source{src})
	result := m.checkHTTPHead(context.Background(), src)

	if !result.Changed {
		t.Error("expected change with new ETag")
	}
	if result.NewETag != `"new-etag-123"` {
		t.Errorf("expected new etag, got %s", result.NewETag)
	}
}

func TestCheckHTTPHeadLastModified(t *testing.T) {
	newTime := time.Now().UTC()
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Last-Modified", newTime.Format(http.TimeFormat))
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	src := &Source{
		ID:           "test",
		Enabled:      true,
		CheckMethod:  CheckHTTPHead,
		URL:          server.URL,
		LastModified: newTime.Add(-24 * time.Hour),
	}

	m := NewMonitor([]*Source{src})
	result := m.checkHTTPHead(context.Background(), src)

	if !result.Changed {
		t.Error("expected change with newer Last-Modified")
	}
}

func TestCheckHTTPHeadServerError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer server.Close()

	src := &Source{
		ID:          "test",
		Enabled:     true,
		CheckMethod: CheckHTTPHead,
		URL:         server.URL,
	}

	m := NewMonitor([]*Source{src})
	result := m.checkHTTPHead(context.Background(), src)

	if result.Error == nil {
		t.Error("expected error for 500 status")
	}
}

func TestCheckHTTPGetContentChange(t *testing.T) {
	callCount := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		callCount++
		w.Write([]byte("content-" + string(rune('0'+callCount))))
	}))
	defer server.Close()

	src := &Source{
		ID:          "test",
		Enabled:     true,
		CheckMethod: CheckHTTPGet,
		URL:         server.URL,
		LastHash:    "some-old-hash",
	}

	m := NewMonitor([]*Source{src})
	result := m.checkHTTPGet(context.Background(), src)

	if !result.Changed {
		t.Error("expected change with different content")
	}
	if result.NewHash == "" {
		t.Error("expected non-empty hash")
	}
	if result.NewHash == "some-old-hash" {
		t.Error("hash should be different from old hash")
	}
}

func TestCheckHTTPGetNoChange(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("static-content"))
	}))
	defer server.Close()

	src := &Source{
		ID:          "test",
		Enabled:     true,
		CheckMethod: CheckHTTPGet,
		URL:         server.URL,
	}

	m := NewMonitor([]*Source{src})

	// First check — get the hash
	result1 := m.checkHTTPGet(context.Background(), src)
	src.LastHash = result1.NewHash

	// Second check — same content
	result2 := m.checkHTTPGet(context.Background(), src)
	if result2.Changed {
		t.Error("expected no change with same content")
	}
}

func TestCheckAllSkipsDisabled(t *testing.T) {
	src := &Source{
		ID:            "disabled",
		Enabled:       false,
		CheckMethod:   CheckScheduled,
		CheckInterval: Duration{1 * time.Second},
	}

	m := NewMonitor([]*Source{src})
	results := m.CheckAll(context.Background())

	if len(results) != 0 {
		t.Errorf("expected 0 results for disabled source, got %d", len(results))
	}
}

func TestCheckAllScheduled(t *testing.T) {
	src := &Source{
		ID:            "scheduled",
		Enabled:       true,
		CheckMethod:   CheckScheduled,
		CheckInterval: Duration{1 * time.Millisecond},
		FetchInterval: Duration{1 * time.Millisecond},
	}

	time.Sleep(2 * time.Millisecond)

	m := NewMonitor([]*Source{src})
	results := m.CheckAll(context.Background())

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if !results[0].Changed {
		t.Error("scheduled source due for fetch should be changed")
	}
}

func TestSourcesDueForFetch(t *testing.T) {
	results := []CheckResult{
		{Source: &Source{ID: "changed"}, Changed: true},
		{Source: &Source{ID: "unchanged"}, Changed: false},
		{Source: &Source{ID: "error"}, Changed: true, Error: errTest},
	}

	m := NewMonitor(nil)
	due := m.SourcesDueForFetch(results)

	if len(due) != 1 {
		t.Fatalf("expected 1 source due, got %d", len(due))
	}
	if due[0].ID != "changed" {
		t.Errorf("expected 'changed', got '%s'", due[0].ID)
	}
}

var errTest = &testError{}

type testError struct{}

func (e *testError) Error() string { return "test error" }

func TestUserAgentHeader(t *testing.T) {
	var receivedUA string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		receivedUA = r.Header.Get("User-Agent")
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	src := &Source{ID: "test", Enabled: true, CheckMethod: CheckHTTPHead, URL: server.URL}
	m := NewMonitor([]*Source{src})
	m.checkHTTPHead(context.Background(), src)

	if receivedUA != "LostInTheToolPool/1.0 (product-catalog-updater)" {
		t.Errorf("unexpected User-Agent: %s", receivedUA)
	}
}
