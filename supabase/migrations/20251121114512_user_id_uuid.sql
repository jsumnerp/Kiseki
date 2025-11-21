ALTER TABLE
    job_applications
ALTER COLUMN
    user_id
SET
    DATA TYPE UUID USING user_id :: UUID;