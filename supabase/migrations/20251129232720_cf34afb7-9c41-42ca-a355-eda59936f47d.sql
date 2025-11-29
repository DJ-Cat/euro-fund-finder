-- Update RLS policy to allow public access to grants
DROP POLICY IF EXISTS "Grants are viewable by authenticated users" ON public.public_grants;

CREATE POLICY "Grants are viewable by everyone"
ON public.public_grants
FOR SELECT
USING (true);