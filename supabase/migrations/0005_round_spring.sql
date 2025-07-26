/*
  # Update setter_entries table structure

  1. Changes
    - Add missing columns
    - Set default values and constraints
    - Ensure all required fields exist

  2. Security
    - No changes to RLS policies needed
*/

-- Drop and recreate setter_entries table with correct structure
DROP TABLE IF EXISTS setter_entries;

CREATE TABLE setter_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  new_leads integer NOT NULL DEFAULT 0,
  expected_calls integer NOT NULL DEFAULT 0,
  made_calls integer NOT NULL DEFAULT 0,
  cancelled_appointments integer NOT NULL DEFAULT 0,
  not_qualified text NOT NULL DEFAULT '',
  sales_appointments integer NOT NULL DEFAULT 0,
  linkedin_connections integer NOT NULL DEFAULT 0,
  loom_sent integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE setter_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on setter_entries"
  ON setter_entries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on setter_entries"
  ON setter_entries FOR INSERT
  TO public
  WITH CHECK (true);

-- Update clean_old_entries function to include setter_entries
CREATE OR REPLACE FUNCTION clean_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM fft_entries WHERE date < CURRENT_DATE;
  DELETE FROM eod_entries WHERE date < CURRENT_DATE;
  DELETE FROM closer_daily_reports WHERE date < CURRENT_DATE;
  DELETE FROM setter_entries WHERE date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;