package handler

import (
	"cms-backend/internal/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthHandler struct{ svc *services.AuthService }

func NewAuthHandler(svc *services.AuthService) *AuthHandler { return &AuthHandler{svc: svc} }

type loginReq struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}
	token, err := h.svc.Login(c, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}
