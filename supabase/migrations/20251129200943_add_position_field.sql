-- Add position column for fractional indexing
ALTER TABLE job_applications 
ADD COLUMN position TEXT NOT NULL DEFAULT 'a0';

-- Create composite index for efficient querying by status and position
CREATE INDEX idx_job_applications_status_position 
ON job_applications(status, position);
