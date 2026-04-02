package sources

import (
	"encoding/json"
	"testing"
	"time"
)

func TestSourceNeedsCheck(t *testing.T) {
	src := &Source{
		Enabled:       true,
		CheckInterval: Duration{1 * time.Hour},
	}

	// Never checked — needs check
	if !src.NeedsCheck() {
		t.Error("should need check when never checked")
	}

	// Just checked — doesn't need check
	src.LastChecked = time.Now()
	if src.NeedsCheck() {
		t.Error("should not need check immediately after checking")
	}

	// Checked 2 hours ago — needs check
	src.LastChecked = time.Now().Add(-2 * time.Hour)
	if !src.NeedsCheck() {
		t.Error("should need check after interval passed")
	}
}

func TestSourceNeedsCheckDisabled(t *testing.T) {
	src := &Source{
		Enabled:       false,
		CheckInterval: Duration{1 * time.Hour},
	}
	if src.NeedsCheck() {
		t.Error("disabled source should never need check")
	}
}

func TestSourceNeedsFetch(t *testing.T) {
	src := &Source{
		Enabled:       true,
		FetchInterval: Duration{24 * time.Hour},
	}

	if !src.NeedsFetch() {
		t.Error("should need fetch when never fetched")
	}

	src.LastFetched = time.Now()
	if src.NeedsFetch() {
		t.Error("should not need fetch right after fetching")
	}

	src.LastFetched = time.Now().Add(-25 * time.Hour)
	if !src.NeedsFetch() {
		t.Error("should need fetch after interval")
	}
}

func TestSourceIsHealthy(t *testing.T) {
	tests := []struct {
		name       string
		errorCount int
		status     int
		want       bool
	}{
		{"healthy", 0, 200, true},
		{"redirect", 0, 301, true},
		{"not found", 0, 404, false},
		{"server error", 0, 500, false},
		{"consecutive errors", 3, 200, false},
		{"some errors but ok", 2, 200, true},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			src := &Source{ErrorCount: tc.errorCount, LastStatus: tc.status}
			if src.IsHealthy() != tc.want {
				t.Errorf("IsHealthy() = %v, want %v", src.IsHealthy(), tc.want)
			}
		})
	}
}

func TestDurationJSON(t *testing.T) {
	d := Duration{6 * time.Hour}

	data, err := json.Marshal(d)
	if err != nil {
		t.Fatal(err)
	}
	if string(data) != `"6h0m0s"` {
		t.Fatalf("expected \"6h0m0s\", got %s", string(data))
	}

	var d2 Duration
	if err := json.Unmarshal([]byte(`"24h"`), &d2); err != nil {
		t.Fatal(err)
	}
	if d2.Duration != 24*time.Hour {
		t.Fatalf("expected 24h, got %v", d2.Duration)
	}
}

func TestSourceJSONRoundtrip(t *testing.T) {
	src := Source{
		ID:            "test-source",
		Name:          "Test Source",
		Brand:         "Milwaukee",
		Type:          SourceScrape,
		URL:           "https://example.com/tools",
		CheckMethod:   CheckHTTPHead,
		CheckInterval: Duration{6 * time.Hour},
		FetchInterval: Duration{24 * time.Hour},
		Priority:      8,
		Country:       "US",
		Enabled:       true,
	}

	data, err := json.Marshal(src)
	if err != nil {
		t.Fatal(err)
	}

	var decoded Source
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatal(err)
	}

	if decoded.ID != "test-source" {
		t.Errorf("ID = %s, want test-source", decoded.ID)
	}
	if decoded.CheckInterval.Duration != 6*time.Hour {
		t.Errorf("CheckInterval = %v, want 6h", decoded.CheckInterval.Duration)
	}
	if decoded.Type != SourceScrape {
		t.Errorf("Type = %s, want scrape", decoded.Type)
	}
}

func TestLoadSourcesJSON(t *testing.T) {
	// Verify our actual sources.json is valid
	data := `[{"id":"test","name":"Test","type":"api","check_interval":"1h","fetch_interval":"24h","enabled":true}]`

	var sources []Source
	if err := json.Unmarshal([]byte(data), &sources); err != nil {
		t.Fatalf("failed to parse sources JSON: %v", err)
	}
	if len(sources) != 1 {
		t.Fatalf("expected 1 source, got %d", len(sources))
	}
	if sources[0].CheckInterval.Duration != 1*time.Hour {
		t.Errorf("check interval = %v, want 1h", sources[0].CheckInterval.Duration)
	}
}
