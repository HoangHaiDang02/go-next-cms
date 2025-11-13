package model

import "time"

type Post struct {
    ID            string    `json:"id"`
    Slug          string    `json:"slug"`
    Title         string    `json:"title"`
    Excerpt       string    `json:"excerpt"`
    Content       string    `json:"content"`
    CoverImageURL string    `json:"coverImageUrl"`
    PublishedAt   time.Time `json:"publishedAt"`
}

