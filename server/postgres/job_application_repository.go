package postgres

import (
	"context"
	"time"

	"kiseki"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewJobApplicationRepository(pool *pgxpool.Pool) kiseki.JobApplicationRepository {
	return &jobApplicationRepository{pool: pool}
}

type jobApplicationRepository struct {
	pool *pgxpool.Pool
}

func (r *jobApplicationRepository) Save(ctx context.Context, jobApplication *kiseki.JobApplication) error {
	// Check if a record with this ID already exists
	existing, err := r.Find(ctx, jobApplication.ID)
	if err != nil {
		return err
	}

	// If no existing record, INSERT
	if existing == nil {
		now := time.Now()
		jobApplication.CreatedAt = now
		jobApplication.UpdatedAt = now

		query, args, err := sq.Insert("job_applications").
			Columns(
				"id",
				"user_id",
				"company",
				"title",
				"description",
				"notes",
				"cv",
				"cover_letter",
				"created_at",
				"updated_at",
				"deleted_at",
				"applied_on",
				"status",
			).
			Values(
				jobApplication.ID,
				jobApplication.UserID,
				jobApplication.Company,
				jobApplication.Title,
				jobApplication.Description,
				jobApplication.Notes,
				jobApplication.CV,
				jobApplication.CoverLetter,
				jobApplication.CreatedAt,
				jobApplication.UpdatedAt,
				jobApplication.DeletedAt,
				jobApplication.AppliedOn,
				kiseki.StatusToDB(jobApplication.Status),
			).
			PlaceholderFormat(sq.Dollar).
			ToSql()
		if err != nil {
			return err
		}

		_, err = r.pool.Exec(ctx, query, args...)
		return err
	}

	// Otherwise, UPDATE existing record
	query, args, err := sq.Update("job_applications").
		Set("company", jobApplication.Company).
		Set("title", jobApplication.Title).
		Set("description", jobApplication.Description).
		Set("notes", jobApplication.Notes).
		Set("cv", jobApplication.CV).
		Set("cover_letter", jobApplication.CoverLetter).
		Set("updated_at", jobApplication.UpdatedAt).
		Set("deleted_at", jobApplication.DeletedAt).
		Set("applied_on", jobApplication.AppliedOn).
		Set("status", kiseki.StatusToDB(jobApplication.Status)).
		Where(sq.Eq{"id": jobApplication.ID}).
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return err
	}

	_, err = r.pool.Exec(ctx, query, args...)
	return err
}

func (r *jobApplicationRepository) Find(ctx context.Context, id string) (*kiseki.JobApplication, error) {
	query, args, err := sq.Select(
		"id",
		"user_id",
		"company",
		"title",
		"description",
		"notes",
		"cv",
		"cover_letter",
		"created_at",
		"updated_at",
		"deleted_at",
		"applied_on",
		"status",
	).
		From("job_applications").
		Where(sq.Eq{"id": id}).
		Where(sq.Eq{"deleted_at": nil}).
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return nil, err
	}

	var ja kiseki.JobApplication
	var statusStr string
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&ja.ID,
		&ja.UserID,
		&ja.Company,
		&ja.Title,
		&ja.Description,
		&ja.Notes,
		&ja.CV,
		&ja.CoverLetter,
		&ja.CreatedAt,
		&ja.UpdatedAt,
		&ja.DeletedAt,
		&ja.AppliedOn,
		&statusStr,
	)

	if err == pgx.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	ja.Status = kiseki.StatusFromDB(statusStr)

	return &ja, nil
}

func (r *jobApplicationRepository) List(ctx context.Context, userID string) ([]*kiseki.JobApplication, error) {
	query, args, err := sq.Select(
		"id",
		"user_id",
		"company",
		"title",
		"description",
		"notes",
		"cv",
		"cover_letter",
		"created_at",
		"updated_at",
		"deleted_at",
		"applied_on",
		"status",
	).
		From("job_applications").
		Where(sq.Eq{"user_id": userID}).
		Where(sq.Eq{"deleted_at": nil}).
		OrderBy("created_at DESC").
		PlaceholderFormat(sq.Dollar).
		ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var jobApplications []*kiseki.JobApplication
	for rows.Next() {
		var ja kiseki.JobApplication
		var statusStr string
		err := rows.Scan(
			&ja.ID,
			&ja.UserID,
			&ja.Company,
			&ja.Title,
			&ja.Description,
			&ja.Notes,
			&ja.CV,
			&ja.CoverLetter,
			&ja.CreatedAt,
			&ja.UpdatedAt,
			&ja.DeletedAt,
			&ja.AppliedOn,
			&statusStr,
		)
		if err != nil {
			return nil, err
		}
		ja.Status = kiseki.StatusFromDB(statusStr)
		jobApplications = append(jobApplications, &ja)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return jobApplications, nil
}
