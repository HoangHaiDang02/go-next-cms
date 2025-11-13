package server

import (
	"context"
	"database/sql"
	sq "github.com/Masterminds/squirrel"
	"golang.org/x/crypto/bcrypt"
	"log"
	"time"
)

// runMigrations creates core tables and seed roles if not exist.
func runMigrations(db *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS users (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )`,
		`CREATE TABLE IF NOT EXISTS roles (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(64) NOT NULL UNIQUE
        )`,
		`CREATE TABLE IF NOT EXISTS user_roles (
            user_id BIGINT NOT NULL,
            role_id BIGINT NOT NULL,
            PRIMARY KEY (user_id, role_id),
            CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        )`,
		`INSERT IGNORE INTO roles (id, name) VALUES (1,'admin'),(2,'editor'),(3,'viewer')`,
	}
	for _, q := range stmts {
		if _, err := db.Exec(q); err != nil {
			return err
		}
	}
	return nil
}

// seedAdmin ensures an admin user exists with email and password.
func seedAdmin(db *sql.DB, email, name, password string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	qb := sq.StatementBuilder.PlaceholderFormat(sq.Question)
	var id int64
	// Check existing user
	sel := qb.Select("id").From("users").Where(sq.Eq{"email": email})
	sqlSel, argsSel, _ := sel.ToSql()
	err := db.QueryRowContext(ctx, sqlSel, argsSel...).Scan(&id)
	if err == sql.ErrNoRows {
		pw, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		now := time.Now()
		ins := qb.Insert("users").Columns("email", "name", "password_hash", "is_active", "created_at", "updated_at").
			Values(email, name, string(pw), true, now, now)
		sqlIns, argsIns, _ := ins.ToSql()
		res, err := db.ExecContext(ctx, sqlIns, argsIns...)
		if err != nil {
			return err
		}
		id, _ = res.LastInsertId()
	} else if err != nil {
		return err
	}
	if id == 0 {
		// Look up again if needed
		_ = db.QueryRowContext(ctx, sqlSel, argsSel...).Scan(&id)
	}
	// Assign admin role
	if id > 0 {
		insRole := qb.Insert("user_roles").Options("IGNORE").Columns("user_id", "role_id").Values(id, 1)
		sqlRole, argsRole, _ := insRole.ToSql()
		if _, err := db.ExecContext(ctx, sqlRole, argsRole...); err != nil {
			return err
		}
	}
	return nil
}

// bootstrapDev applies migrations and seeds an admin account in development.
func bootstrapDev(db *sql.DB) {
	if err := runMigrations(db); err != nil {
		log.Printf("bootstrap: migrations error: %v", err)
		return
	}
	if err := seedAdmin(db, "admin@example.com", "Admin", "123"); err != nil {
		log.Printf("bootstrap: seed admin error: %v", err)
		return
	}
	log.Printf("bootstrap: development database ready (admin@example.com / 123)")
}
