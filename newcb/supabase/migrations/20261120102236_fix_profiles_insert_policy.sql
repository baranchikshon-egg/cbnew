/*
# Fix profiles INSERT policy and grant

## Problem
The profiles table was created with only SELECT and UPDATE grants for authenticated users.
When a new user signs up, the app tries to INSERT a profile row, but there is no INSERT grant
and no INSERT policy — causing a 42501 RLS error ("new row violates row-level security policy").

## Changes
- Add INSERT grant to authenticated role on profiles
- Add INSERT policy allowing users to create only their own profile row
- Keep existing SELECT and UPDATE policies unchanged
*/

GRANT INSERT ON profiles TO authenticated;

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
