-- Create storage bucket for LP builder assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('lp-assets', 'lp-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload lp assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'lp-assets' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to update
CREATE POLICY "Admins can update lp assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'lp-assets' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to delete
CREATE POLICY "Admins can delete lp assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'lp-assets' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow public read access
CREATE POLICY "Public can view lp assets"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'lp-assets');