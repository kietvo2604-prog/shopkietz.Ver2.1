CREATE POLICY "CTV can delete products in assigned categories"
ON public.products
FOR DELETE
TO authenticated
USING (is_active_ctv(auth.uid()));