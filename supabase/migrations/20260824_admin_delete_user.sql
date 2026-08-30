-- Migration: admin_delete_user RPC function
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verify caller is admin or main admin email
  IF NOT (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'fauzymnf29@gmail.com'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can delete users';
  END IF;

  -- 1. Delete from application tables
  DELETE FROM public.profiles WHERE user_id = target_user_id;
  DELETE FROM public.entitlements WHERE user_id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.prompt_usage WHERE user_id = target_user_id;
  DELETE FROM public.user_signing_secrets WHERE user_id = target_user_id;
  DELETE FROM public.saved_projects WHERE user_id = target_user_id;
  DELETE FROM public.affiliate_referrals WHERE user_id = target_user_id;
  
  -- 2. Delete from auth.users
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
