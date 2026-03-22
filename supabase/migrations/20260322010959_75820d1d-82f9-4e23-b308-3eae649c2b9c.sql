
CREATE TABLE public.user_signing_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text DEFAULT '',
  secret text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_signing_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own secret" ON public.user_signing_secrets
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own secret" ON public.user_signing_secrets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own secret" ON public.user_signing_secrets
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own secret" ON public.user_signing_secrets
FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user secrets" ON public.user_signing_secrets
FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
