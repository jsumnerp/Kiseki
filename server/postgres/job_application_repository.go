package postgres

import (
	"context"
	"database/sql"

	"kiseki"
)

func NewJobApplicationRepository(db *sql.DB) kiseki.JobApplicationRepository {
	return &jobApplicationRepository{db: db}
}

type jobApplicationRepository struct {
	db *sql.DB
}

func (r *jobApplicationRepository) Save(ctx context.Context, jobApplication *kiseki.JobApplication) error {
	return nil
}

func (r *jobApplicationRepository) Find(ctx context.Context, id string) (*kiseki.JobApplication, error) {
	return nil, nil
}

func (r *jobApplicationRepository) List(ctx context.Context, userID string) ([]*kiseki.JobApplication, error) {
	return nil, nil
}
