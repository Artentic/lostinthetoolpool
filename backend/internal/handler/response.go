package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"sync"
)

// Buffer pool eliminates allocations on every JSON response.
var bufPool = sync.Pool{
	New: func() any { return bytes.NewBuffer(make([]byte, 0, 1024)) },
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	buf := bufPool.Get().(*bytes.Buffer)
	buf.Reset()
	defer bufPool.Put(buf)

	if err := json.NewEncoder(buf).Encode(data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(buf.Bytes())
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	// Hand-write small JSON to avoid allocation
	w.Write([]byte(`{"error":"`))
	w.Write([]byte(message))
	w.Write([]byte(`"}`))
}

// writeCached writes pre-serialized JSON bytes directly — zero marshal overhead.
func writeCached(w http.ResponseWriter, status int, data []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(data)
}
