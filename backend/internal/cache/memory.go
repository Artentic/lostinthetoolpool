package cache

import (
	"sync"
	"time"
)

// Memory is an in-process cache that lives as long as the Lambda instance.
// On warm invocations (~5-15 min), cached data is reused. On cold starts,
// it refetches from the database. Thread-safe via sync.RWMutex.
type Memory struct {
	mu    sync.RWMutex
	items map[string]entry
}

type entry struct {
	data      []byte
	expiresAt time.Time
}

func New() *Memory {
	return &Memory{
		items: make(map[string]entry),
	}
}

func (m *Memory) Get(key string) ([]byte, bool) {
	m.mu.RLock()
	e, ok := m.items[key]
	m.mu.RUnlock()

	if !ok || time.Now().After(e.expiresAt) {
		if ok {
			// Expired — clean up
			m.mu.Lock()
			delete(m.items, key)
			m.mu.Unlock()
		}
		return nil, false
	}
	return e.data, true
}

func (m *Memory) Set(key string, data []byte, ttl time.Duration) {
	m.mu.Lock()
	m.items[key] = entry{
		data:      data,
		expiresAt: time.Now().Add(ttl),
	}
	m.mu.Unlock()
}

func (m *Memory) Delete(key string) {
	m.mu.Lock()
	delete(m.items, key)
	m.mu.Unlock()
}
