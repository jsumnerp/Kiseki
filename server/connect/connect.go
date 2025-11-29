package connect

import (
	"context"
	"log"
	"net/http"
	"time"

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

// loggingMiddleware logs HTTP requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create a custom response writer to capture status code
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(lrw, r)

		duration := time.Since(start)
		log.Printf("%s %s %d %v", r.Method, r.URL.Path, lrw.statusCode, duration)
	})
}

// loggingResponseWriter wraps http.ResponseWriter to capture status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
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

	// Wrap mux with CORS and logging middleware
	corsHandler := corsMiddleware(mux)
	loggedHandler := loggingMiddleware(corsHandler)

	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)

	s := http.Server{
		Addr:      "localhost:8080",
		Handler:   loggedHandler,
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

// UpdateJobApplicationStatus implements apiconnect.ServiceHandler.
func (h *handler) UpdateJobApplicationStatus(ctx context.Context, req *connect.Request[api.UpdateJobApplicationStatusRequest]) (*connect.Response[api.UpdateJobApplicationStatusResponse], error) {
	res, err := h.service.UpdateJobApplicationStatus(ctx, req.Msg)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(res), nil
}
