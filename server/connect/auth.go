package connect

import (
	"context"
	"strings"

	"kiseki/service"

	"connectrpc.com/connect"
	"github.com/golang-jwt/jwt/v4"
)

// JWTMiddleware creates a Connect middleware that extracts the JWT token from the
// Authorization header and adds it to the context.
func JWTMiddleware(secret []byte, method jwt.SigningMethod, newClaims service.ClaimsFactory) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			// Get the Authorization header
			auth := req.Header().Get("Authorization")
			if auth == "" {
				return next(ctx, req)
			}

			// Check if it's a Bearer token
			parts := strings.Split(auth, " ")
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				return next(ctx, req)
			}

			// Add the token to the context
			tokenString := parts[1]

			// Parse and validate the token
			token, err := jwt.ParseWithClaims(tokenString, newClaims(), func(token *jwt.Token) (interface{}, error) {
				// Validate the signing method
				if token.Method != method {
					return nil, service.ErrUnexpectedSigningMethod
				}
				return secret, nil
			})
			if err != nil {
				if e, ok := err.(*jwt.ValidationError); ok {
					switch {
					case e.Errors&jwt.ValidationErrorMalformed != 0:
						return nil, service.ErrTokenMalformed
					case e.Errors&jwt.ValidationErrorExpired != 0:
						return nil, service.ErrTokenExpired
					case e.Errors&jwt.ValidationErrorNotValidYet != 0:
						return nil, service.ErrTokenNotActive
					case e.Inner != nil:
						return nil, e.Inner
					}
				}
				return nil, err
			}

			if !token.Valid {
				return nil, service.ErrTokenInvalid
			}

			// Add claims to context
			ctx = context.WithValue(ctx, service.JWTClaimsContextKey, token.Claims)

			return next(ctx, req)
		}
	}
}
