package kiseki

import (
	"time"

	"github.com/google/uuid"
)

type JobApplication struct {
	ID          string
	UserID      string
	Company     string
	Title       string
	Description *string
	Notes       *string
	CV          *string
	CoverLetter *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
}

type NewJobApplicationParams struct {
	UserID      string
	Company     string
	Title       string
	Description *string
	Notes       *string
	CV          *string
	CoverLetter *string
}

func NewJobApplication(params NewJobApplicationParams) JobApplication {
	return JobApplication{
		ID:          uuid.New().String(),
		UserID:      params.UserID,
		Company:     params.Company,
		Title:       params.Title,
		Description: params.Description,
		Notes:       params.Notes,
		CV:          params.CV,
		CoverLetter: params.CoverLetter,
	}
}

func (j *JobApplication) Delete() {
	now := time.Now()
	j.DeletedAt = &now
}

type UpdateJobApplicationParams struct {
	Company     string
	Title       string
	Description *string
	Notes       *string
	CV          *string
	CoverLetter *string
}

func (j *JobApplication) Update(params UpdateJobApplicationParams) {
	now := time.Now()
	j.UpdatedAt = now

	j.Company = params.Company
	j.Title = params.Title
	j.Description = params.Description
	j.Notes = params.Notes
	j.CV = params.CV
	j.CoverLetter = params.CoverLetter
}
