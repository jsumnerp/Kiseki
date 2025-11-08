package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v4"
)

type contextKey string

const (
	// JWTClaimsContextKey holds the key used to store the JWT Claims in the context.
	JWTClaimsContextKey contextKey = "JWTClaims"
)

var (
	// ErrTokenContextMissing denotes a token was not passed into the parsing
	// middleware's context.
	ErrTokenContextMissing = errors.New("token up for parsing was not passed through the context")

	// ErrTokenInvalid denotes a token was not able to be validated.
	ErrTokenInvalid = errors.New("JWT was invalid")

	// ErrTokenExpired denotes a token's expire header (exp) has since passed.
	ErrTokenExpired = errors.New("JWT is expired")

	// ErrTokenMalformed denotes a token was not formatted as a JWT.
	ErrTokenMalformed = errors.New("JWT is malformed")

	// ErrTokenNotActive denotes a token's not before header (nbf) is in the future.
	ErrTokenNotActive = errors.New("token is not valid yet")

	// ErrUnexpectedSigningMethod denotes a token was signed with an unexpected
	// signing method.
	ErrUnexpectedSigningMethod = errors.New("unexpected signing method")
)

// ClaimsFactory is a factory for jwt.Claims.
type ClaimsFactory func() jwt.Claims

// GetClaims retrieves the JWT claims from the context.
// Returns nil if no claims are found.
func GetClaims(ctx context.Context) jwt.Claims {
	if claims, ok := ctx.Value(JWTClaimsContextKey).(jwt.Claims); ok {
		return claims
	}
	return nil
}

// getUserID retrieves the user ID from the JWT claims in the context.
// Returns an error if no claims are found or if the user ID is missing.
func getUserID(ctx context.Context) (string, error) {
	claims, ok := ctx.Value(JWTClaimsContextKey).(jwt.Claims)
	if !ok {
		return "", fmt.Errorf("no JWT claims found in context")
	}

	// Try to get Supabase claims
	if supabaseClaims, ok := claims.(*SupabaseClaims); ok {
		return supabaseClaims.UserID, nil
	}

	// Try to get from map claims
	if mapClaims, ok := claims.(jwt.MapClaims); ok {
		if userID, ok := mapClaims["sub"].(string); ok {
			return userID, nil
		}
	}

	return "", fmt.Errorf("no user ID found in JWT claims")
}

// SupabaseClaims represents the claims in a Supabase JWT
type SupabaseClaims struct {
	jwt.RegisteredClaims
	UserID string `json:"sub"`
	Email  string `json:"email"`
	Role   string `json:"role"`
}
