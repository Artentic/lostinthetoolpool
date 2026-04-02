package cache

import (
	"sync"
	"time"
)

// Memory is a high-performance in-process cache. Zero external dependencies.
// Uses sharded locks to reduce contention under concurrent access.
const shardCount = 16

type Memory struct {
	shards [shardCount]shard
}

type shard struct {
	mu    sync.RWMutex
	items map[string]entry
}

type entry struct {
	data      []byte
	expiresAt int64 // unix nano — faster than time.Time comparison
}

func New() *Memory {
	m := &Memory{}
	for i := range m.shards {
		m.shards[i].items = make(map[string]entry, 64)
	}
	return m
}

func (m *Memory) getShard(key string) *shard {
	// FNV-1a inspired hash — fast, no allocation
	h := uint32(2166136261)
	for i := 0; i < len(key); i++ {
		h ^= uint32(key[i])
		h *= 16777619
	}
	return &m.shards[h%shardCount]
}

func (m *Memory) Get(key string) ([]byte, bool) {
	s := m.getShard(key)
	s.mu.RLock()
	e, ok := s.items[key]
	s.mu.RUnlock()

	if !ok {
		return nil, false
	}

	if time.Now().UnixNano() > e.expiresAt {
		s.mu.Lock()
		delete(s.items, key)
		s.mu.Unlock()
		return nil, false
	}
	return e.data, true
}

func (m *Memory) Set(key string, data []byte, ttl time.Duration) {
	s := m.getShard(key)
	s.mu.Lock()
	s.items[key] = entry{
		data:      data,
		expiresAt: time.Now().Add(ttl).UnixNano(),
	}
	s.mu.Unlock()
}

func (m *Memory) Delete(key string) {
	s := m.getShard(key)
	s.mu.Lock()
	delete(s.items, key)
	s.mu.Unlock()
}
