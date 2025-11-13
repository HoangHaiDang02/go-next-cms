package main

import (
    "log"
    "net/http"
    "cms-backend/internal/config"
    "cms-backend/internal/server"
)

func main() {
    cfg := config.Load()
    r := server.New(cfg)
    addr := ":" + cfg.Port
    log.Printf("Starting server on %s", addr)
    if err := http.ListenAndServe(addr, r); err != nil {
        log.Fatal(err)
    }
}

