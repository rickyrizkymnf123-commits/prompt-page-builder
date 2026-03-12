
CREATE TABLE public.pending_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  email text,
  name text,
  phone text,
  product_code text NOT NULL DEFAULT 'LPE',
  checkout_url text,
  payment_status text NOT NULL DEFAULT 'unpaid',
  reminder_count integer NOT NULL DEFAULT 0,
  last_reminder_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pending_payments ENABLE ROW LEVEL SECURITY;

-- Only service role (edge functions) will access this table
-- Admins can view for monitoring
CREATE POLICY "Admins can view pending payments"
  ON public.pending_payments FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_pending_payments_updated_at
  BEFORE UPDATE ON public.pending_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
