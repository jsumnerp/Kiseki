package connect

import (
	"context"
	"net/http"

	"kiseki/api/v1"
	"kiseki/api/v1/apiconnect"
	"kiseki/service"

	"connectrpc.com/connect"
	"github.com/golang-jwt/jwt/v4"
)

// corsMiddleware adds CORS headers to allow cross-origin requests from the frontend
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

type handler struct {
	service service.Service
}

func NewServer(svc service.Service, jwtSecret []byte) *http.Server {
	h := &handler{
		service: svc,
	}

	mux := http.NewServeMux()
	path, handler := apiconnect.NewServiceHandler(h, connect.WithInterceptors(JWTMiddleware(jwtSecret, jwt.SigningMethodHS256, func() jwt.Claims { return &service.SupabaseClaims{} })))

	mux.Handle(path, handler)

	// Wrap mux with CORS middleware
	corsHandler := corsMiddleware(mux)

	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)

	s := http.Server{
		Addr:      "localhost:8080",
		Handler:   corsHandler,
		Protocols: p,
	}

	return &s
}

// CreateJobApplication implements apiconnect.ServiceHandler.
func (h *handler) CreateJobApplication(ctx context.Context, req *connect.Request[api.CreateJobApplicationRequest]) (*connect.Response[api.CreateJobApplicationResponse], error) {
	res, err := h.service.CreateJobApplication(ctx, req.Msg)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(res), nil
}

// DeleteJobApplication implements apiconnect.ServiceHandler.
func (h *handler) DeleteJobApplication(ctx context.Context, req *connect.Request[api.DeleteJobApplicationRequest]) (*connect.Response[api.DeleteJobApplicationResponse], error) {
	res, err := h.service.DeleteJobApplication(ctx, req.Msg)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(res), nil
}

// ListJobApplications implements apiconnect.ServiceHandler.
func (h *handler) ListJobApplications(ctx context.Context, req *connect.Request[api.ListJobApplicationsRequest]) (*connect.Response[api.ListJobApplicationsResponse], error) {
	res, err := h.service.ListJobApplications(ctx, req.Msg)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(res), nil
}

// UpdateJobApplication implements apiconnect.ServiceHandler.
func (h *handler) UpdateJobApplication(ctx context.Context, req *connect.Request[api.UpdateJobApplicationRequest]) (*connect.Response[api.UpdateJobApplicationResponse], error) {
	res, err := h.service.UpdateJobApplication(ctx, req.Msg)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(res), nil
}
