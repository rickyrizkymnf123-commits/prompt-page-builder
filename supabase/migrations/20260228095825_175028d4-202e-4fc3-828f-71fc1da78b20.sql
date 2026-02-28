
-- Drop restrictive policies on entitlements
DROP POLICY IF EXISTS "Users can view own entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Admins can view all entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Users can insert own entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Admins can update entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Admins can delete entitlements" ON public.entitlements;

-- Recreate as PERMISSIVE
CREATE POLICY "Users can view own entitlements" ON public.entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all entitlements" ON public.entitlements FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own entitlements" ON public.entitlements FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id) AND (status = 'pending'::text));
CREATE POLICY "Admins can update entitlements" ON public.entitlements FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete entitlements" ON public.entitlements FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles - add user read own role
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id)
