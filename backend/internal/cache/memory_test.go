package cache

import (
	"sync"
	"testing"
	"time"
)

func TestSetAndGet(t *testing.T) {
	c := New()

	c.Set("key1", []byte("value1"), 1*time.Minute)

	data, ok := c.Get("key1")
	if !ok {
		t.Fatal("expected cache hit")
	}
	if string(data) != "value1" {
		t.Fatalf("expected 'value1', got '%s'", string(data))
	}
}

func TestGetMiss(t *testing.T) {
	c := New()

	_, ok := c.Get("nonexistent")
	if ok {
		t.Fatal("expected cache miss")
	}
}

func TestTTLExpiry(t *testing.T) {
	c := New()

	c.Set("expires", []byte("data"), 50*time.Millisecond)

	// Should hit immediately
	_, ok := c.Get("expires")
	if !ok {
		t.Fatal("expected cache hit before expiry")
	}

	// Wait for expiry
	time.Sleep(60 * time.Millisecond)

	_, ok = c.Get("expires")
	if ok {
		t.Fatal("expected cache miss after expiry")
	}
}

func TestOverwrite(t *testing.T) {
	c := New()

	c.Set("key", []byte("first"), 1*time.Minute)
	c.Set("key", []byte("second"), 1*time.Minute)

	data, ok := c.Get("key")
	if !ok {
		t.Fatal("expected cache hit")
	}
	if string(data) != "second" {
		t.Fatalf("expected 'second', got '%s'", string(data))
	}
}

func TestDelete(t *testing.T) {
	c := New()

	c.Set("key", []byte("value"), 1*time.Minute)
	c.Delete("key")

	_, ok := c.Get("key")
	if ok {
		t.Fatal("expected cache miss after delete")
	}
}

func TestDeleteNonexistent(t *testing.T) {
	c := New()
	// Should not panic
	c.Delete("nonexistent")
}

func TestConcurrentAccess(t *testing.T) {
	c := New()
	var wg sync.WaitGroup

	// Concurrent writes
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			key := string(rune('a' + i%26))
			c.Set(key, []byte("value"), 1*time.Minute)
		}(i)
	}

	// Concurrent reads
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			key := string(rune('a' + i%26))
			c.Get(key)
		}(i)
	}

	wg.Wait()
}

func TestExpiredEntryCleanedOnGet(t *testing.T) {
	c := New()

	c.Set("expired", []byte("data"), 1*time.Millisecond)
	time.Sleep(5 * time.Millisecond)

	// Get should clean up the expired entry
	c.Get("expired")

	// Verify internal map is clean
	c.mu.RLock()
	_, exists := c.items["expired"]
	c.mu.RUnlock()

	if exists {
		t.Fatal("expired entry should be removed from internal map")
	}
}

func TestMultipleKeys(t *testing.T) {
	c := New()

	c.Set("a", []byte("1"), 1*time.Minute)
	c.Set("b", []byte("2"), 1*time.Minute)
	c.Set("c", []byte("3"), 1*time.Minute)

	for _, tc := range []struct{ key, want string }{
		{"a", "1"}, {"b", "2"}, {"c", "3"},
	} {
		data, ok := c.Get(tc.key)
		if !ok {
			t.Fatalf("expected hit for key '%s'", tc.key)
		}
		if string(data) != tc.want {
			t.Fatalf("key '%s': expected '%s', got '%s'", tc.key, tc.want, string(data))
		}
	}
}

func TestZeroTTL(t *testing.T) {
	c := New()

	// Zero TTL should expire immediately
	c.Set("zero", []byte("data"), 0)

	// Might still be accessible within the same millisecond,
	// but after a small delay should be gone
	time.Sleep(1 * time.Millisecond)

	_, ok := c.Get("zero")
	if ok {
		t.Fatal("expected miss with zero TTL")
	}
}
