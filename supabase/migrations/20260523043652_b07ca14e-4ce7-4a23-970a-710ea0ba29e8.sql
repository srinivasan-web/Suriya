
ALTER TABLE public.feature_requests
  ADD CONSTRAINT feature_requests_publication_len CHECK (char_length(publication_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT feature_requests_contact_len     CHECK (char_length(contact_name) BETWEEN 1 AND 120),
  ADD CONSTRAINT feature_requests_email_format    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(email) <= 255),
  ADD CONSTRAINT feature_requests_website_len     CHECK (website_url IS NULL OR char_length(website_url) <= 500),
  ADD CONSTRAINT feature_requests_audience_size   CHECK (audience_size IS NULL OR (audience_size >= 0 AND audience_size <= 1000000000)),
  ADD CONSTRAINT feature_requests_audience_desc   CHECK (audience_description IS NULL OR char_length(audience_description) <= 1000),
  ADD CONSTRAINT feature_requests_message_len     CHECK (message IS NULL OR char_length(message) <= 2000),
  ADD CONSTRAINT feature_requests_include_count   CHECK (array_length(what_to_include, 1) IS NULL OR array_length(what_to_include, 1) <= 12);
