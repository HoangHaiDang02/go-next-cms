package model

import "time"

type User struct {
    ID        int64     `json:"id"`
    Email     string    `json:"email"`
    Name      string    `json:"name"`
    Password  string    `json:"-"`
    IsActive  bool      `json:"isActive"`
    CreatedAt time.Time `json:"createdAt"`
    UpdatedAt time.Time `json:"updatedAt"`
}

type Role struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
}

