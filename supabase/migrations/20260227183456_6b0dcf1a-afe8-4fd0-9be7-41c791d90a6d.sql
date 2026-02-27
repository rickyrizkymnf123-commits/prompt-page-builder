CREATE TABLE public.lp_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  thumbnail_url text,
  html_content text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.lp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active templates" ON public.lp_templates
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.lp_templates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));