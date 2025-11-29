package kiseki

import (
	"strings"
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
	AppliedOn   time.Time
	Status      JobApplicationStatus
	Position    string
}

type NewJobApplicationParams struct {
	UserID      string
	Company     string
	Title       string
	Description *string
	Notes       *string
	CV          *string
	CoverLetter *string
	AppliedOn   time.Time
	Status      JobApplicationStatus
	Position    string
}

func NewJobApplication(params NewJobApplicationParams) JobApplication {
	now := time.Now()
	return JobApplication{
		ID:          uuid.New().String(),
		UserID:      params.UserID,
		Company:     params.Company,
		Title:       params.Title,
		Description: params.Description,
		Notes:       params.Notes,
		CV:          params.CV,
		CoverLetter: params.CoverLetter,
		CreatedAt:   now,
		UpdatedAt:   now,
		AppliedOn:   params.AppliedOn,
		Status:      params.Status,
		Position:    params.Position,
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
	AppliedOn   time.Time
	Status      JobApplicationStatus
	Position    string
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
	j.AppliedOn = params.AppliedOn
	j.Status = params.Status
	j.Position = params.Position
}

// JobApplicationStatus is the domain enum for job application status.
// The numeric values intentionally match the protobuf enum values so
// the service layer can cast between them when necessary.
type JobApplicationStatus int32

const (
	JobApplicationStatusUnspecified JobApplicationStatus = 0
	JobApplicationStatusApplied     JobApplicationStatus = 1
	JobApplicationStatusScreening   JobApplicationStatus = 2
	JobApplicationStatusInterview   JobApplicationStatus = 3
	JobApplicationStatusOffer       JobApplicationStatus = 4
	JobApplicationStatusRejected    JobApplicationStatus = 5
	JobApplicationStatusWithdrawn   JobApplicationStatus = 6
	JobApplicationStatusAccepted    JobApplicationStatus = 7
)

// StatusToDB converts the domain enum to the DB enum label (no prefix), e.g. APPLIED.
func StatusToDB(s JobApplicationStatus) string {
	switch s {
	case JobApplicationStatusApplied:
		return "APPLIED"
	case JobApplicationStatusScreening:
		return "SCREENING"
	case JobApplicationStatusInterview:
		return "INTERVIEW"
	case JobApplicationStatusOffer:
		return "OFFER"
	case JobApplicationStatusRejected:
		return "REJECTED"
	case JobApplicationStatusWithdrawn:
		return "WITHDRAWN"
	case JobApplicationStatusAccepted:
		return "ACCEPTED"
	default:
		return "UNSPECIFIED"
	}
}

// StatusFromDB converts a DB label to the domain enum. Case-insensitive.
func StatusFromDB(db string) JobApplicationStatus {
	switch strings.ToUpper(strings.TrimSpace(db)) {
	case "APPLIED":
		return JobApplicationStatusApplied
	case "SCREENING":
		return JobApplicationStatusScreening
	case "INTERVIEW":
		return JobApplicationStatusInterview
	case "OFFER":
		return JobApplicationStatusOffer
	case "REJECTED":
		return JobApplicationStatusRejected
	case "WITHDRAWN":
		return JobApplicationStatusWithdrawn
	case "ACCEPTED":
		return JobApplicationStatusAccepted
	default:
		return JobApplicationStatusUnspecified
	}
}
