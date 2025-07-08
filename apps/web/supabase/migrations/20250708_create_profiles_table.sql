-- Migration: Create profiles table for user onboarding and profile management

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    username text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    profile_picture_url text,
    agency text NOT NULL,
    property_type text NOT NULL,
    state text NOT NULL,
    timezone text,
    hasCompletedOnboarding boolean NOT NULL DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT timezone('utc', now()),
    updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Trigger to update updated_at on row modification
CREATE OR REPLACE FUNCTION public.profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_updated_at();

-- RLS: Enable and restrict access to own profile only
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by owners only" ON public.profiles;
CREATE POLICY "Profiles are viewable by owners only"
    ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are updatable by owners only" ON public.profiles;
CREATE POLICY "Profiles are updatable by owners only"
    ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are insertable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are insertable by authenticated users"
    ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
