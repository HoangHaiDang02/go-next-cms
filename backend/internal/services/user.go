package services

import (
	"cms-backend/internal/models"
	"cms-backend/internal/repositories"
	"context"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct{ users repository.UserRepository }

func NewUserService(users repository.UserRepository) *UserService { return &UserService{users: users} }

func (s *UserService) List(ctx context.Context, limit, offset int) ([]model.User, error) {
	return s.users.List(ctx, limit, offset)
}

func (s *UserService) Create(ctx context.Context, email, name, password string, isActive bool) (int64, error) {
	pw, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return s.users.Create(ctx, email, name, string(pw), isActive)
}

func (s *UserService) Update(ctx context.Context, id int64, email, name string, isActive bool) error {
	return s.users.Update(ctx, id, email, name, isActive)
}

func (s *UserService) UpdatePassword(ctx context.Context, id int64, password string) error {
	pw, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return s.users.UpdatePassword(ctx, id, string(pw))
}

func (s *UserService) Delete(ctx context.Context, id int64) error { return s.users.Delete(ctx, id) }

func (s *UserService) AssignRole(ctx context.Context, id, roleID int64) error {
	return s.users.AssignRole(ctx, id, roleID)
}

func (s *UserService) RemoveRole(ctx context.Context, id, roleID int64) error {
	return s.users.RemoveRole(ctx, id, roleID)
}
