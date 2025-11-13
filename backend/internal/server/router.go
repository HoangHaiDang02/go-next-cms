package server

import (
	"cms-backend/internal/config"
	handler "cms-backend/internal/handlers"
	middleware "cms-backend/internal/middleware"
	repository "cms-backend/internal/repositories"
	"cms-backend/internal/services"
	"database/sql"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

func New(cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// CORS
	c := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	if cfg.AllowOrigin != "" {
		c.AllowOrigins = []string{cfg.AllowOrigin}
	} else {
		c.AllowAllOrigins = true
	}
	r.Use(cors.New(c))

	// DB connect
	dsn := cfg.DBUser + ":" + cfg.DBPass + "@tcp(" + cfg.DBHost + ":" + cfg.DBPort + ")/" + cfg.DBName + "?" + cfg.DBParams
	sqldb, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Printf("DB open error: %v", err)
	}

	// In development, auto-run migrations and seed admin
	if cfg.Env == "development" || cfg.Env == "dev" || cfg.Env == "" {
		bootstrapDev(sqldb)
	}

	// Repos
	postRepo := repository.NewMemoryPostRepository()
	userRepo := repository.NewMySQLUserRepository(sqldb)

	// Services
	authSvc := services.NewAuthService(userRepo, cfg.JWTSecret)
	userSvc := services.NewUserService(userRepo)

	// Handlers
	posts := handler.NewPostsHandler(postRepo)
	auth := handler.NewAuthHandler(authSvc)
	users := handler.NewUsersHandler(userSvc)

	api := r.Group("/api")
	{
		api.GET("/posts", posts.List)
		api.GET("/posts/:slug", posts.GetBySlug)

		api.POST("/auth/login", auth.Login)

		admin := api.Group("/users")
		admin.Use(middleware.RequireAuth(cfg), middleware.RequireRoles("admin"))
		{
			admin.GET("", users.List)
			admin.POST("", users.Create)
			admin.PUT(":id", users.Update)
			admin.PATCH(":id/password", users.UpdatePassword)
			admin.DELETE(":id", users.Delete)
			admin.POST(":id/roles", users.AssignRole)
			admin.DELETE(":id/roles", users.RemoveRole)
		}
	}

	// Health
	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })
	return r
}
