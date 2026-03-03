
-- Create demos table for demo landing page management
CREATE TABLE public.demos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Demo Baru',
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'Kategori',
  thumbnail_url TEXT DEFAULT '',
  html_code TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage demos"
ON public.demos
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active demos
CREATE POLICY "Authenticated users can view active demos"
ON public.demos
FOR SELECT
TO authenticated
USING (is_active = true);

-- Trigger for updated_at
CREATE TRIGGER update_demos_updated_at
BEFORE UPDATE ON public.demos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure embed_form_code exists in app_settings
INSERT INTO public.app_settings (key, value) 
VALUES ('embed_form_code', '')
ON CONFLICT (key) DO NOTHING;
