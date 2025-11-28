-- Migration: add status enum and column to job_applications
-- Uses the JobApplicationStatus enum names from api.v1 (see server/api/v1/api.pb.go)
DO $$ BEGIN IF NOT EXISTS (
    SELECT
        1
    FROM
        pg_type
    WHERE
        typname = 'job_application_status'
) THEN CREATE TYPE job_application_status AS ENUM (
    'UNSPECIFIED',
    'APPLIED',
    'SCREENING',
    'INTERVIEW',
    'OFFER',
    'REJECTED',
    'WITHDRAWN',
    'ACCEPTED'
);

END IF;

END $$;

-- Add the status column (default to UNSPECIFIED so proto default maps cleanly)
ALTER TABLE
    job_applications
ADD
    COLUMN IF NOT EXISTS status job_application_status DEFAULT 'UNSPECIFIED';

-- Populate existing rows if any
UPDATE
    job_applications
SET
    status = 'UNSPECIFIED'
WHERE
    status IS NULL;

-- Make the column required
ALTER TABLE
    job_applications
ALTER COLUMN
    status
SET
    NOT NULL;