# Go + Next CMS (Users + RBAC + Docker Compose)

This repo provides a minimal CMS stack:
- Backend: Go (Gin) with JWT auth, users CRUD, RBAC (roles: admin/editor/viewer).
- Frontend: Next.js sample.
- Database: MySQL 8 via Docker Compose with schema auto-init.

## Run with Docker Compose

Prerequisites: Docker + Docker Compose.

```bash
docker-compose up --build
```

Services:
- MySQL: localhost:3306 (user `cms` / pass `cmspass` / db `cms`)
- Backend API: http://localhost:8080
- Frontend: http://localhost:3000

## Environment

Backend env (see `docker-compose.yml`):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET`
- `ALLOW_ORIGIN`

Frontend env:
- `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8080`)

## Database schema / RBAC

Tables:
- `users(id, email, name, password_hash, is_active, created_at, updated_at)`
- `roles(id, name)` with seeds: `admin`, `editor`, `viewer`
- `user_roles(user_id, role_id)`

Schema auto-created by mounting `db/init` into MySQL container init directory.

## Bootstrap an admin user

No default users are created. After containers are up, create an admin:

```bash
# connect to DB
docker exec -it $(docker ps -qf name=db) mysql -ucms -pcmspass cms -e "SELECT 1"

# generate a bcrypt hash using Go (example) or use your own
# NOTE: Replace the hash below with a hash you generate for 'Admin#123'

INSERT INTO users (email, name, password_hash, is_active, created_at, updated_at)
VALUES ('admin@example.com', 'Admin', '$2a$10$N1YoJq2rO6m7yQxkq8m6F.UVZr2hCw5Qz7hH3wBq9o7tP7n8l3JfS', 1, NOW(), NOW());

# grant admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.email='admin@example.com' AND r.name='admin';
```

Then login:

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{ "email": "admin@example.com", "password": "Admin#123" }
```

Use the returned `Bearer <token>` for admin endpoints:
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/password`
- `DELETE /api/users/:id`
- `POST /api/users/:id/roles` { roleId }
- `DELETE /api/users/:id/roles` { roleId }

## Local dev (optional)

You can run the backend locally if you have Go 1.21+ and a MySQL instance. Set env vars then:

```bash
cd backend
go run ./cmd/server
```

# go-next-cms
