package server

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "cms-backend/internal/config"
    "cms-backend/internal/utils"
)

func requireAuth(cfg *config.Config) gin.HandlerFunc {
    return func(c *gin.Context) {
        header := c.GetHeader("Authorization")
        if header == "" || !strings.HasPrefix(header, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"}); return
        }
        token := strings.TrimPrefix(header, "Bearer ")
        claims, err := utils.ParseJWT(cfg.JWTSecret, token)
        if err != nil { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"}); return }
        c.Set("uid", claims.UserID)
        c.Set("roles", claims.Roles)
        c.Next()
    }
}

func requireRoles(roles ...string) gin.HandlerFunc {
    need := map[string]struct{}{}
    for _, r := range roles { need[r] = struct{}{} }
    return func(c *gin.Context) {
        v, ok := c.Get("roles"); if !ok { c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"}); return }
        have, _ := v.([]string)
        for _, r := range have { if _, ok := need[r]; ok { c.Next(); return } }
        c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
    }
}

