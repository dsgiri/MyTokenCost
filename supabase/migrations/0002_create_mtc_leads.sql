-- Create mtc_leads table for resilient conversion lead tracking
CREATE TABLE mtc_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    lead_type TEXT NOT NULL, -- 'demo', 'audit', 'enterprise'
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE mtc_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so public users can submit the contact form
CREATE POLICY "Allow anonymous insert to mtc_leads" 
ON mtc_leads FOR INSERT 
WITH CHECK (true);

-- Allow authenticated reads (such as Clerk users / admin portal using supabase client)
CREATE POLICY "Allow authenticated select to mtc_leads" 
ON mtc_leads FOR SELECT 
TO authenticated 
USING (true);
