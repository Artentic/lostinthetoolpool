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

	_, ok := c.Get("expires")
	if !ok {
		t.Fatal("expected hit before expiry")
	}

	time.Sleep(60 * time.Millisecond)

	_, ok = c.Get("expires")
	if ok {
		t.Fatal("expected miss after expiry")
	}
}

func TestOverwrite(t *testing.T) {
	c := New()
	c.Set("key", []byte("first"), 1*time.Minute)
	c.Set("key", []byte("second"), 1*time.Minute)

	data, ok := c.Get("key")
	if !ok {
		t.Fatal("expected hit")
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
		t.Fatal("expected miss after delete")
	}
}

func TestDeleteNonexistent(t *testing.T) {
	c := New()
	c.Delete("nonexistent") // should not panic
}

func TestConcurrentAccess(t *testing.T) {
	c := New()
	var wg sync.WaitGroup

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			key := string(rune('a' + i%26))
			c.Set(key, []byte("value"), 1*time.Minute)
		}(i)
	}

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

	// Get triggers cleanup
	_, ok := c.Get("expired")
	if ok {
		t.Fatal("expected miss for expired entry")
	}

	// Second get should also miss cleanly
	_, ok = c.Get("expired")
	if ok {
		t.Fatal("expired entry should stay gone")
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
			t.Fatalf("expected hit for '%s'", tc.key)
		}
		if string(data) != tc.want {
			t.Fatalf("key '%s': expected '%s', got '%s'", tc.key, tc.want, string(data))
		}
	}
}

func TestZeroTTL(t *testing.T) {
	c := New()
	c.Set("zero", []byte("data"), 0)
	time.Sleep(1 * time.Millisecond)

	_, ok := c.Get("zero")
	if ok {
		t.Fatal("expected miss with zero TTL")
	}
}

func TestSharding(t *testing.T) {
	c := New()

	// Ensure different keys hit different shards (no panic, no data loss)
	for i := 0; i < 1000; i++ {
		key := string(rune(i))
		c.Set(key, []byte("v"), 1*time.Minute)
	}
	for i := 0; i < 1000; i++ {
		key := string(rune(i))
		_, ok := c.Get(key)
		if !ok {
			t.Fatalf("shard test: missed key %d", i)
		}
	}
}

func BenchmarkCacheGet(b *testing.B) {
	c := New()
	c.Set("bench", []byte("data"), 1*time.Hour)

	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			c.Get("bench")
		}
	})
}

func BenchmarkCacheSet(b *testing.B) {
	c := New()
	data := []byte("benchmark data payload")

	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		i := 0
		for pb.Next() {
			c.Set(string(rune(i%1000)), data, 1*time.Minute)
			i++
		}
	})
}
