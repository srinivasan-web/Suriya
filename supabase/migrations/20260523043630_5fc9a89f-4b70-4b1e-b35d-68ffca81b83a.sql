
-- Feature requests from wedding editors / blogs
CREATE TABLE public.feature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  website_url TEXT,
  audience_size INTEGER,
  audience_description TEXT,
  target_publish_date DATE,
  what_to_include TEXT[] NOT NULL DEFAULT '{}',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a request
CREATE POLICY "Anyone can submit feature requests"
  ON public.feature_requests
  FOR INSERT
  WITH CHECK (true);

-- No public SELECT — owners review via the backend dashboard.

-- Couple stories / testimonials gallery (public read)
CREATE TABLE public.couple_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_names TEXT NOT NULL,
  story TEXT NOT NULL,
  testimonial_quote TEXT NOT NULL,
  photo_url TEXT,
  wedding_date DATE,
  location TEXT,
  link_back_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_stories ENABLE ROW LEVEL SECURITY;

-- Anyone can view published stories
CREATE POLICY "Published stories are viewable by everyone"
  ON public.couple_stories
  FOR SELECT
  USING (published = true);
