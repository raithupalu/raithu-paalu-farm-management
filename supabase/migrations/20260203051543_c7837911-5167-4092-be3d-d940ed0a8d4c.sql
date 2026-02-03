-- Fix audit logs INSERT policy to be more restrictive
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Audit logs should only be inserted by trigger functions (SECURITY DEFINER)
-- No direct insert from users needed since log_audit_action handles it
-- This is acceptable as the trigger function runs with SECURITY DEFINER