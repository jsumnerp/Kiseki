-- Migration: add applied_on timestamp and enable RLS on job_applications
-- Adds row-level security policies so authenticated users can only operate on their own rows
ALTER TABLE
    job_applications
ADD
    COLUMN IF NOT EXISTS applied_on TIMESTAMP;

-- Enable Row Level Security
ALTER TABLE
    job_applications ENABLE ROW LEVEL SECURITY;

-- Revoke wide-open privileges from anonymous/public roles (optional but explicit)
REVOKE ALL ON job_applications
FROM
    public;

-- Allow authenticated users (via auth.uid()) to SELECT only their own rows
CREATE POLICY "Users can select their own job applications" ON job_applications FOR
SELECT
    USING (
        (
            SELECT
                auth.uid ()
        ) = user_id
    );

-- Allow authenticated users to INSERT only rows that have user_id = auth.uid()
CREATE POLICY "Users can insert their own job applications" ON job_applications FOR
INSERT
    WITH CHECK (
        (
            SELECT
                auth.uid ()
        ) = user_id
    );

-- Allow authenticated users to UPDATE only their own rows
CREATE POLICY "Users can update their own job applications" ON job_applications FOR
UPDATE
    USING (
        (
            SELECT
                auth.uid ()
        ) = user_id
    ) WITH CHECK (
        (
            (
                SELECT
                    auth.uid ()
            )
        ) = user_id
    );

-- Allow authenticated users to DELETE only their own rows
CREATE POLICY "Users can delete their own job applications" ON job_applications FOR DELETE USING (
    (
        SELECT
            auth.uid ()
    ) = user_id
);

CREATE INDEX userid ON job_applications USING BTREE (user_id);