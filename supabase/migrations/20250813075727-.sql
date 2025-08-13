-- Create compliance_checks table for tracking Meta policy compliance
CREATE TABLE public.compliance_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  original_text TEXT NOT NULL,
  fixed_text TEXT,
  violations JSONB DEFAULT '[]'::jsonb,
  compliance_status TEXT NOT NULL CHECK (compliance_status IN ('passed', 'failed', 'fixed')),
  content_id UUID, -- Optional reference to saved_ad_content
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own compliance checks" 
ON public.compliance_checks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own compliance checks" 
ON public.compliance_checks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance checks" 
ON public.compliance_checks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_compliance_checks_updated_at
BEFORE UPDATE ON public.compliance_checks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_compliance_checks_user_id ON public.compliance_checks(user_id);
CREATE INDEX idx_compliance_checks_content_type ON public.compliance_checks(content_type);
CREATE INDEX idx_compliance_checks_status ON public.compliance_checks(compliance_status);