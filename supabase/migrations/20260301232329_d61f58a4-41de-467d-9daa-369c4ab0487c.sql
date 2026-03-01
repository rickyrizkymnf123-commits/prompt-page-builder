
CREATE TABLE public.prompt_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  used_count integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.prompt_usage ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX prompt_usage_user_id_idx ON public.prompt_usage (user_id);

CREATE POLICY "Users can view own usage" ON public.prompt_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON public.prompt_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON public.prompt_usage FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage usage" ON public.prompt_usage FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
