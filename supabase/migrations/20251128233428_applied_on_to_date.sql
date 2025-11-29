-- Convert applied_on from TIMESTAMPTZ to DATE
ALTER TABLE job_applications 
ALTER COLUMN applied_on TYPE DATE USING applied_on::DATE;

-- Update default to use CURRENT_DATE instead of NOW()
ALTER TABLE job_applications 
ALTER COLUMN applied_on SET DEFAULT CURRENT_DATE;
