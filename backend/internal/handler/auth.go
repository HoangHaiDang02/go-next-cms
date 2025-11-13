package handler

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "cms-backend/internal/service"
)

type AuthHandler struct { svc *service.AuthService }

func NewAuthHandler(svc *service.AuthService) *AuthHandler { return &AuthHandler{svc: svc} }

type loginReq struct { Email string `json:"email" binding:"required"`; Password string `json:"password" binding:"required"` }

func (h *AuthHandler) Login(c *gin.Context) {
    var req loginReq
    if err := c.ShouldBindJSON(&req); err != nil { c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"}); return }
    token, err := h.svc.Login(c, req.Email, req.Password)
    if err != nil { c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"}); return }
    c.JSON(http.StatusOK, gin.H{"token": token})
}

