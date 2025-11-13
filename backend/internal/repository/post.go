package repository

import (
    "errors"
    "time"
    "cms-backend/internal/model"
)

type PostRepository interface {
    List() []model.Post
    GetBySlug(slug string) (model.Post, error)
}

type MemoryPostRepository struct { posts []model.Post }

func NewMemoryPostRepository() *MemoryPostRepository { return &MemoryPostRepository{posts: seed()} }

func (m *MemoryPostRepository) List() []model.Post { return m.posts }

func (m *MemoryPostRepository) GetBySlug(slug string) (model.Post, error) {
    for _, p := range m.posts {
        if p.Slug == slug { return p, nil }
    }
    return model.Post{}, errors.New("not found")
}

func seed() []model.Post {
    now := time.Now().Add(-24 * time.Hour)
    return []model.Post{
        { ID: "1", Slug: "hello-world", Title: "Hello World", Excerpt: "First post in the CMS starter.", Content: "This is a simple CMS starter powered by Go Gin + Next.js.", CoverImageURL: "", PublishedAt: now },
        { ID: "2", Slug: "second-post", Title: "Second Post", Excerpt: "Another sample post to show the list.", Content: "Posts are currently served from in-memory storage for simplicity.", CoverImageURL: "", PublishedAt: now.Add(-48 * time.Hour) },
    }
}

