import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://zcdghllhuceuzgxhakkv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZGdobGxodWNldXpneGhha2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTMwOTAsImV4cCI6MjA2OTcyOTA5MH0.qbVA2ZC_D27of5GxdNGz0DYfETEVS-7T16AwDsBMHi4'
);
