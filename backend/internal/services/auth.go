package services

import (
	"cms-backend/internal/repositories"
	"cms-backend/internal/utils"
	"context"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type AuthService struct {
	users     repository.UserRepository
	jwtSecret string
}

func NewAuthService(users repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{users: users, jwtSecret: jwtSecret}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	u, err := s.users.GetByEmail(ctx, email)
	if err != nil || !u.IsActive {
		return "", errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	roles, _ := s.users.RolesOf(ctx, u.ID)
	token, err := utils.SignJWT(s.jwtSecret, utils.UserClaims{UserID: u.ID, Email: u.Email, Roles: roles, ExpiresAt: time.Now().Add(24 * time.Hour)})
	if err != nil {
		return "", err
	}
	return token, nil
}
