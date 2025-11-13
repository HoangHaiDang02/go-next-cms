package config

import (
    "os"
)

type Config struct {
    Port        string
    AllowOrigin string
    Env         string
    DBHost      string
    DBPort      string
    DBUser      string
    DBPass      string
    DBName      string
    DBParams    string
    JWTSecret   string
}

func get(key, def string) string {
    if v := os.Getenv(key); v != "" { return v }
    return def
}

func Load() *Config {
    return &Config{
        Port:        get("PORT", "8080"),
        AllowOrigin: os.Getenv("ALLOW_ORIGIN"),
        Env:         get("APP_ENV", get("GO_ENV", get("ENV", ""))),
        DBHost:      get("DB_HOST", "localhost"),
        DBPort:      get("DB_PORT", "3306"),
        DBUser:      get("DB_USER", "cms"),
        DBPass:      get("DB_PASS", "cmspass"),
        DBName:      get("DB_NAME", "cms"),
        DBParams:    get("DB_PARAMS", "parseTime=true&charset=utf8mb4,utf8"),
        JWTSecret:   get("JWT_SECRET", "dev-secret"),
    }
}
