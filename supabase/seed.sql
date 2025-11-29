-- Seed data for job applications
-- This will create 20 job applications with various statuses and positions

INSERT INTO job_applications (
  id,
  user_id,
  company,
  title,
  description,
  status,
  applied_on,
  position,
  notes
) VALUES
  -- APPLIED (3 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Google', 'Senior Software Engineer', 'Work on cloud infrastructure and distributed systems', 'APPLIED', '2024-11-15', 'a0', 'Referred by John'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Meta', 'Frontend Engineer', 'Build next-generation social platform features', 'APPLIED', '2024-11-18', 'a1', NULL),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Stripe', 'Full Stack Engineer', 'Work on payment processing systems', 'APPLIED', '2024-11-20', 'a2', 'Really excited about this one'),
  
  -- SCREENING (4 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Airbnb', 'Backend Engineer', 'Build scalable microservices', 'SCREENING', '2024-11-10', 'a0', 'Phone screen scheduled for next week'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Netflix', 'DevOps Engineer', 'Manage cloud infrastructure at scale', 'SCREENING', '2024-11-12', 'a1', NULL),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Uber', 'Software Engineer', 'Work on real-time mapping systems', 'SCREENING', '2024-11-14', 'a2', 'HR mentioned strong team culture'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Shopify', 'Platform Engineer', 'Build merchant tools and APIs', 'SCREENING', '2024-11-16', 'a3', NULL),
  
  -- INTERVIEW (5 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Amazon', 'SDE II', 'Work on AWS services', 'INTERVIEW', '2024-11-05', 'a0', 'Final round next Friday'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Apple', 'Software Engineer', 'iOS platform development', 'INTERVIEW', '2024-11-06', 'a1', 'Very impressed with the team'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Microsoft', 'Cloud Engineer', 'Azure infrastructure', 'INTERVIEW', '2024-11-08', 'a2', NULL),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Salesforce', 'Full Stack Developer', 'CRM platform features', 'INTERVIEW', '2024-11-09', 'a3', 'Technical interview went well'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'LinkedIn', 'Backend Engineer', 'Social networking infrastructure', 'INTERVIEW', '2024-11-11', 'a4', NULL),
  
  -- OFFER (2 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Dropbox', 'Senior Engineer', 'File storage and sync systems', 'OFFER', '2024-10-25', 'a0', 'Offer received! Need to decide by Dec 1'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Square', 'Software Engineer', 'Payment processing APIs', 'OFFER', '2024-10-28', 'a1', 'Great compensation package'),
  
  -- REJECTED (3 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Snap', 'ML Engineer', 'Computer vision for AR features', 'REJECTED', '2024-10-15', 'a0', 'Not selected after final round'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Twitter', 'Backend Engineer', 'Real-time messaging systems', 'REJECTED', '2024-10-18', 'a1', NULL),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Pinterest', 'Full Stack Engineer', 'Discovery and recommendations', 'REJECTED', '2024-10-20', 'a2', 'Position filled internally'),
  
  -- WITHDRAWN (2 applications)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'Lyft', 'Software Engineer', 'Mapping and routing systems', 'WITHDRAWN', '2024-10-10', 'a0', 'Withdrew after learning about team dynamics'),
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'DoorDash', 'Backend Engineer', 'Logistics platform', 'WITHDRAWN', '2024-10-12', 'a1', NULL),
  
  -- ACCEPTED (1 application)
  (gen_random_uuid(), '570a9011-a662-4d7f-841b-7377833fda14', 'GitHub', 'Platform Engineer', 'CI/CD and developer tools', 'ACCEPTED', '2024-10-01', 'a0', 'Accepted offer! Starting Jan 2025');
