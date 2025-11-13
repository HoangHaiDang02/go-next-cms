package repository

import (
	"cms-backend/internal/models"
	"context"
	"database/sql"
	"errors"
	sq "github.com/Masterminds/squirrel"
	"time"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (model.User, error)
	GetByID(ctx context.Context, id int64) (model.User, error)
	List(ctx context.Context, limit, offset int) ([]model.User, error)
	Create(ctx context.Context, email, name, passwordHash string, isActive bool) (int64, error)
	Update(ctx context.Context, id int64, email, name string, isActive bool) error
	UpdatePassword(ctx context.Context, id int64, passwordHash string) error
	Delete(ctx context.Context, id int64) error
	AssignRole(ctx context.Context, userID, roleID int64) error
	RemoveRole(ctx context.Context, userID, roleID int64) error
	RolesOf(ctx context.Context, userID int64) ([]string, error)
}

type MySQLUserRepository struct {
	db *sql.DB
	qb sq.StatementBuilderType
}

func NewMySQLUserRepository(db *sql.DB) *MySQLUserRepository {
	return &MySQLUserRepository{db: db, qb: sq.StatementBuilder.PlaceholderFormat(sq.Question)}
}

func (r *MySQLUserRepository) GetByEmail(ctx context.Context, email string) (model.User, error) {
	var u model.User
	q := r.qb.Select("id", "email", "name", "password_hash", "is_active", "created_at", "updated_at").
		From("users").Where(sq.Eq{"email": email})
	sqlStr, args, _ := q.ToSql()
	row := r.db.QueryRowContext(ctx, sqlStr, args...)
	var pw string
	if err := row.Scan(&u.ID, &u.Email, &u.Name, &pw, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return model.User{}, err
	}
	u.Password = pw
	return u, nil
}

func (r *MySQLUserRepository) GetByID(ctx context.Context, id int64) (model.User, error) {
	var u model.User
	q := r.qb.Select("id", "email", "name", "password_hash", "is_active", "created_at", "updated_at").
		From("users").Where(sq.Eq{"id": id})
	sqlStr, args, _ := q.ToSql()
	row := r.db.QueryRowContext(ctx, sqlStr, args...)
	var pw string
	if err := row.Scan(&u.ID, &u.Email, &u.Name, &pw, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return model.User{}, err
	}
	u.Password = pw
	return u, nil
}

func (r *MySQLUserRepository) List(ctx context.Context, limit, offset int) ([]model.User, error) {
	q := r.qb.Select("id", "email", "name", "is_active", "created_at", "updated_at").
		From("users").OrderBy("id DESC").Limit(uint64(limit)).Offset(uint64(offset))
	sqlStr, args, _ := q.ToSql()
	rows, err := r.db.QueryContext(ctx, sqlStr, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []model.User
	for rows.Next() {
		var u model.User
		if err := rows.Scan(&u.ID, &u.Email, &u.Name, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

func (r *MySQLUserRepository) Create(ctx context.Context, email, name, passwordHash string, isActive bool) (int64, error) {
	now := time.Now()
	q := r.qb.Insert("users").
		Columns("email", "name", "password_hash", "is_active", "created_at", "updated_at").
		Values(email, name, passwordHash, isActive, now, now)
	sqlStr, args, _ := q.ToSql()
	res, err := r.db.ExecContext(ctx, sqlStr, args...)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *MySQLUserRepository) Update(ctx context.Context, id int64, email, name string, isActive bool) error {
	q := r.qb.Update("users").
		Set("email", email).Set("name", name).Set("is_active", isActive).Set("updated_at", time.Now()).
		Where(sq.Eq{"id": id})
	sqlStr, args, _ := q.ToSql()
	_, err := r.db.ExecContext(ctx, sqlStr, args...)
	return err
}

func (r *MySQLUserRepository) UpdatePassword(ctx context.Context, id int64, passwordHash string) error {
	q := r.qb.Update("users").Set("password_hash", passwordHash).Set("updated_at", time.Now()).Where(sq.Eq{"id": id})
	sqlStr, args, _ := q.ToSql()
	_, err := r.db.ExecContext(ctx, sqlStr, args...)
	return err
}

func (r *MySQLUserRepository) Delete(ctx context.Context, id int64) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	// delete roles
	q1 := r.qb.Delete("user_roles").Where(sq.Eq{"user_id": id})
	sql1, args1, _ := q1.ToSql()
	if _, err := tx.ExecContext(ctx, sql1, args1...); err != nil {
		tx.Rollback()
		return err
	}
	// delete user
	q2 := r.qb.Delete("users").Where(sq.Eq{"id": id})
	sql2, args2, _ := q2.ToSql()
	if _, err := tx.ExecContext(ctx, sql2, args2...); err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (r *MySQLUserRepository) AssignRole(ctx context.Context, userID, roleID int64) error {
	q := r.qb.Insert("user_roles").Options("IGNORE").Columns("user_id", "role_id").Values(userID, roleID)
	sqlStr, args, _ := q.ToSql()
	_, err := r.db.ExecContext(ctx, sqlStr, args...)
	return err
}

func (r *MySQLUserRepository) RemoveRole(ctx context.Context, userID, roleID int64) error {
	q := r.qb.Delete("user_roles").Where(sq.Eq{"user_id": userID, "role_id": roleID})
	sqlStr, args, _ := q.ToSql()
	res, err := r.db.ExecContext(ctx, sqlStr, args...)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return errors.New("not found")
	}
	return nil
}

func (r *MySQLUserRepository) RolesOf(ctx context.Context, userID int64) ([]string, error) {
	q := r.qb.Select("r.name").From("roles r").Join("user_roles ur ON ur.role_id = r.id").Where(sq.Eq{"ur.user_id": userID})
	sqlStr, args, _ := q.ToSql()
	rows, err := r.db.QueryContext(ctx, sqlStr, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []string
	for rows.Next() {
		var s string
		if err := rows.Scan(&s); err != nil {
			return nil, err
		}
		out = append(out, s)
	}
	return out, rows.Err()
}
