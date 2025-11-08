package kiseki

import "context"

type JobApplicationRepository interface {
	Save(ctx context.Context, jobApplication *JobApplication) error
	Find(ctx context.Context, id string) (*JobApplication, error)
	List(ctx context.Context, userID string) ([]*JobApplication, error)
}
