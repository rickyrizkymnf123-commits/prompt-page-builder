
-- Fix existing RESTRICTIVE policies to PERMISSIVE for entitlements
DROP POLICY IF EXISTS "Users can view own entitlements" ON public.entitlements;
CREATE POLICY "Users can view own entitlements"
  ON public.entitlements FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies for entitlements
CREATE POLICY "Admins can view all entitlements"
  ON public.entitlements FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update entitlements"
  ON public.entitlements FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete entitlements"
  ON public.entitlements FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Users can insert own entitlements (for self-registration with pending status)
CREATE POLICY "Users can insert own entitlements"
  ON public.entitlements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Fix existing RESTRICTIVE policies to PERMISSIVE for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies for profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Users can insert own profile (backup if trigger fails)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
