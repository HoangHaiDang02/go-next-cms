package handler

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "cms-backend/internal/repository"
)

type PostsHandler struct { repo repository.PostRepository }

func NewPostsHandler(repo repository.PostRepository) *PostsHandler { return &PostsHandler{repo: repo} }

func (h *PostsHandler) List(c *gin.Context) {
    c.JSON(http.StatusOK, h.repo.List())
}

func (h *PostsHandler) GetBySlug(c *gin.Context) {
    slug := c.Param("slug")
    post, err := h.repo.GetBySlug(slug)
    if err != nil { c.JSON(http.StatusNotFound, gin.H{"error": "not found"}); return }
    c.JSON(http.StatusOK, post)
}

