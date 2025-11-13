package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
    UserID   int64
    Email    string
    Roles    []string
    ExpiresAt time.Time
}

func SignJWT(secret string, c UserClaims) (string, error) {
    claims := jwt.MapClaims{
        "uid": c.UserID,
        "email": c.Email,
        "roles": c.Roles,
        "exp": c.ExpiresAt.Unix(),
    }
    t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return t.SignedString([]byte(secret))
}

func ParseJWT(secret, token string) (*UserClaims, error) {
    parsed, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) { return []byte(secret), nil })
    if err != nil || !parsed.Valid { return nil, err }
    if m, ok := parsed.Claims.(jwt.MapClaims); ok {
        uc := &UserClaims{}
        if v, ok := m["uid"].(float64); ok { uc.UserID = int64(v) }
        if v, ok := m["email"].(string); ok { uc.Email = v }
        if vv, ok := m["roles"].([]interface{}); ok {
            for _, x := range vv { if s, ok := x.(string); ok { uc.Roles = append(uc.Roles, s) } }
        }
        if v, ok := m["exp"].(float64); ok { uc.ExpiresAt = time.Unix(int64(v), 0) }
        return uc, nil
    }
    return nil, jwt.ErrTokenInvalidClaims
}

