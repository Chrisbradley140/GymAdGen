-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

-- Create policies for logo uploads
CREATE POLICY "Anyone can view logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Users can upload their own logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);