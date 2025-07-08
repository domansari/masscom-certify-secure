
-- Add batch_number column to certificates table
ALTER TABLE public.certificates 
ADD COLUMN batch_number text;

-- Create index for better performance when filtering by batch
CREATE INDEX idx_certificates_batch_number ON public.certificates(batch_number);
