package service

import (
	"context"

	"kiseki"

	"kiseki/api/v1"

	"github.com/samber/lo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type Service interface {
	CreateJobApplication(ctx context.Context, req *api.CreateJobApplicationRequest) (*api.CreateJobApplicationResponse, error)
	ListJobApplications(ctx context.Context, req *api.ListJobApplicationsRequest) (*api.ListJobApplicationsResponse, error)
	UpdateJobApplication(ctx context.Context, req *api.UpdateJobApplicationRequest) (*api.UpdateJobApplicationResponse, error)
	DeleteJobApplication(ctx context.Context, req *api.DeleteJobApplicationRequest) (*api.DeleteJobApplicationResponse, error)
}

type service struct {
	jobApplicationRepository kiseki.JobApplicationRepository
}

func NewService(jobApplicationRepository kiseki.JobApplicationRepository) Service {
	return &service{
		jobApplicationRepository: jobApplicationRepository,
	}
}

// CreateJobApplication implements Service.
func (s *service) CreateJobApplication(ctx context.Context, req *api.CreateJobApplicationRequest) (*api.CreateJobApplicationResponse, error) {
	userID, err := getUserID(ctx)
	if err != nil {
		return nil, err
	}

	jobApplication := kiseki.NewJobApplication(kiseki.NewJobApplicationParams{
		UserID:      userID,
		Company:     req.Company,
		Title:       req.Title,
		Description: stringPtrFromValue(req.Description),
		Notes:       stringPtrFromValue(req.Notes),
		CV:          stringPtrFromValue(req.Cv),
		CoverLetter: stringPtrFromValue(req.CoverLetter),
		AppliedOn:   req.AppliedOn.AsTime(),
		Status:      kiseki.JobApplicationStatus(req.Status),
	})

	if err := s.jobApplicationRepository.Save(ctx, &jobApplication); err != nil {
		return nil, err
	}

	return &api.CreateJobApplicationResponse{
		JobApplication: &api.JobApplication{
			Id:          jobApplication.ID,
			Company:     jobApplication.Company,
			Title:       jobApplication.Title,
			Description: stringPtr(jobApplication.Description),
			Notes:       stringPtr(jobApplication.Notes),
			Cv:          stringPtr(jobApplication.CV),
			CoverLetter: stringPtr(jobApplication.CoverLetter),
			CreatedAt:   timestamppb.New(jobApplication.CreatedAt),
			UpdatedAt:   timestamppb.New(jobApplication.UpdatedAt),
			AppliedOn:   timestamppb.New(jobApplication.AppliedOn),
			Status:      api.JobApplicationStatus(jobApplication.Status),
		},
	}, nil
}

// DeleteJobApplication implements Service.
func (s *service) DeleteJobApplication(ctx context.Context, req *api.DeleteJobApplicationRequest) (*api.DeleteJobApplicationResponse, error) {
	ja, err := s.jobApplicationRepository.Find(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	if ja == nil {
		return nil, status.Errorf(codes.NotFound, "job application not found")
	}

	userID, err := getUserID(ctx)
	if err != nil {
		return nil, err
	}

	if ja.UserID != userID {
		return nil, status.Errorf(codes.PermissionDenied, "you are not allowed to delete this job application")
	}

	ja.Delete()

	if err := s.jobApplicationRepository.Save(ctx, ja); err != nil {
		return nil, err
	}
	return &api.DeleteJobApplicationResponse{}, nil
}

// ListJobApplications implements Service.
func (s *service) ListJobApplications(ctx context.Context, req *api.ListJobApplicationsRequest) (*api.ListJobApplicationsResponse, error) {
	userID, err := getUserID(ctx)
	if err != nil {
		return nil, err
	}

	jas, err := s.jobApplicationRepository.List(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &api.ListJobApplicationsResponse{
		JobApplications: lo.Map(jas, func(ja *kiseki.JobApplication, _ int) *api.JobApplication {
			return &api.JobApplication{
				Id:          ja.ID,
				Company:     ja.Company,
				Title:       ja.Title,
				Description: stringPtr(ja.Description),
				Notes:       stringPtr(ja.Notes),
				Cv:          stringPtr(ja.CV),
				CoverLetter: stringPtr(ja.CoverLetter),
				CreatedAt:   timestamppb.New(ja.CreatedAt),
				UpdatedAt:   timestamppb.New(ja.UpdatedAt),
				AppliedOn:   timestamppb.New(ja.AppliedOn),
				Status:      api.JobApplicationStatus(ja.Status),
			}
		}),
	}, nil
}

// UpdateJobApplication implements Service.
func (s *service) UpdateJobApplication(ctx context.Context, req *api.UpdateJobApplicationRequest) (*api.UpdateJobApplicationResponse, error) {
	ja, err := s.jobApplicationRepository.Find(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	if ja == nil {
		return nil, status.Errorf(codes.NotFound, "job application not found")
	}

	userID, err := getUserID(ctx)
	if err != nil {
		return nil, err
	}

	if ja.UserID != userID {
		return nil, status.Errorf(codes.PermissionDenied, "you are not allowed to update this job application")
	}

	ja.Update(kiseki.UpdateJobApplicationParams{
		Company:     req.Company,
		Title:       req.Title,
		Description: stringPtrFromValue(req.Description),
		Notes:       stringPtrFromValue(req.Notes),
		CV:          stringPtrFromValue(req.Cv),
		CoverLetter: stringPtrFromValue(req.CoverLetter),
		AppliedOn:   req.AppliedOn.AsTime(),
		Status:      kiseki.JobApplicationStatus(req.Status),
	})

	if err := s.jobApplicationRepository.Save(ctx, ja); err != nil {
		return nil, err
	}

	return &api.UpdateJobApplicationResponse{
		JobApplication: &api.JobApplication{
			Id:          ja.ID,
			Company:     ja.Company,
			Title:       ja.Title,
			Description: stringPtr(ja.Description),
			Notes:       stringPtr(ja.Notes),
			Cv:          stringPtr(ja.CV),
			CoverLetter: stringPtr(ja.CoverLetter),
			CreatedAt:   timestamppb.New(ja.CreatedAt),
			UpdatedAt:   timestamppb.New(ja.UpdatedAt),
			AppliedOn:   timestamppb.New(ja.AppliedOn),
			Status:      api.JobApplicationStatus(ja.Status),
		},
	}, nil
}

// stringPtrFromValue converts a *wrapperspb.StringValue to a *string.
// Returns nil if the input is nil.
func stringPtrFromValue(v *wrapperspb.StringValue) *string {
	if v == nil {
		return nil
	}
	return &v.Value
}

// stringPtr converts a *string to a *wrapperspb.StringValue.
// Returns nil if the input is nil.
func stringPtr(s *string) *wrapperspb.StringValue {
	if s == nil {
		return nil
	}
	return wrapperspb.String(*s)
}
