package repository

import (
    "context"
    "database/sql"
    "errors"
    "time"
    "cms-backend/internal/model"
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

type MySQLUserRepository struct { db *sql.DB }

func NewMySQLUserRepository(db *sql.DB) *MySQLUserRepository { return &MySQLUserRepository{db: db} }

func (r *MySQLUserRepository) GetByEmail(ctx context.Context, email string) (model.User, error) {
    var u model.User
    row := r.db.QueryRowContext(ctx, `SELECT id, email, name, password_hash, is_active, created_at, updated_at FROM users WHERE email = ?`, email)
    var pw string
    if err := row.Scan(&u.ID, &u.Email, &u.Name, &pw, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil { return model.User{}, err }
    u.Password = pw
    return u, nil
}

func (r *MySQLUserRepository) GetByID(ctx context.Context, id int64) (model.User, error) {
    var u model.User
    row := r.db.QueryRowContext(ctx, `SELECT id, email, name, password_hash, is_active, created_at, updated_at FROM users WHERE id = ?`, id)
    var pw string
    if err := row.Scan(&u.ID, &u.Email, &u.Name, &pw, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil { return model.User{}, err }
    u.Password = pw
    return u, nil
}

func (r *MySQLUserRepository) List(ctx context.Context, limit, offset int) ([]model.User, error) {
    rows, err := r.db.QueryContext(ctx, `SELECT id, email, name, is_active, created_at, updated_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?`, limit, offset)
    if err != nil { return nil, err }
    defer rows.Close()
    var out []model.User
    for rows.Next() {
        var u model.User
        if err := rows.Scan(&u.ID, &u.Email, &u.Name, &u.IsActive, &u.CreatedAt, &u.UpdatedAt); err != nil { return nil, err }
        out = append(out, u)
    }
    return out, rows.Err()
}

func (r *MySQLUserRepository) Create(ctx context.Context, email, name, passwordHash string, isActive bool) (int64, error) {
    now := time.Now()
    res, err := r.db.ExecContext(ctx, `INSERT INTO users (email, name, password_hash, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`, email, name, passwordHash, isActive, now, now)
    if err != nil { return 0, err }
    return res.LastInsertId()
}

func (r *MySQLUserRepository) Update(ctx context.Context, id int64, email, name string, isActive bool) error {
    _, err := r.db.ExecContext(ctx, `UPDATE users SET email = ?, name = ?, is_active = ?, updated_at = ? WHERE id = ?`, email, name, isActive, time.Now(), id)
    return err
}

func (r *MySQLUserRepository) UpdatePassword(ctx context.Context, id int64, passwordHash string) error {
    _, err := r.db.ExecContext(ctx, `UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`, passwordHash, time.Now(), id)
    return err
}

func (r *MySQLUserRepository) Delete(ctx context.Context, id int64) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil { return err }
    if _, err := tx.ExecContext(ctx, `DELETE FROM user_roles WHERE user_id = ?`, id); err != nil { tx.Rollback(); return err }
    if _, err := tx.ExecContext(ctx, `DELETE FROM users WHERE id = ?`, id); err != nil { tx.Rollback(); return err }
    return tx.Commit()
}

func (r *MySQLUserRepository) AssignRole(ctx context.Context, userID, roleID int64) error {
    _, err := r.db.ExecContext(ctx, `INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`, userID, roleID)
    return err
}

func (r *MySQLUserRepository) RemoveRole(ctx context.Context, userID, roleID int64) error {
    res, err := r.db.ExecContext(ctx, `DELETE FROM user_roles WHERE user_id = ? AND role_id = ?`, userID, roleID)
    if err != nil { return err }
    if n, _ := res.RowsAffected(); n == 0 { return errors.New("not found") }
    return nil
}

func (r *MySQLUserRepository) RolesOf(ctx context.Context, userID int64) ([]string, error) {
    rows, err := r.db.QueryContext(ctx, `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?`, userID)
    if err != nil { return nil, err }
    defer rows.Close()
    var out []string
    for rows.Next() { var s string; if err := rows.Scan(&s); err != nil { return nil, err }; out = append(out, s) }
    return out, rows.Err()
}

