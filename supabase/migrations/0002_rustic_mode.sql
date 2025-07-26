/*
  # Add Closer and Setter tables

  1. New Tables
    - `closer_entries`
      - All fields for closer reporting
    - `setter_entries`
      - All fields for setter reporting
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public access
*/

-- Create Closer entries table
CREATE TABLE IF NOT EXISTS closer_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  new_leads integer NOT NULL,
  expected_calls integer NOT NULL,
  made_calls integer NOT NULL,
  cancelled_appointments integer NOT NULL,
  no_shows text NOT NULL,
  not_qualified text NOT NULL,
  sales_appointments integer NOT NULL,
  planned_sorting integer NOT NULL,
  loom_sent integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Create Setter entries table
CREATE TABLE IF NOT EXISTS setter_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  leads_contacted integer NOT NULL,
  emails_sent integer NOT NULL,
  calls_made integer NOT NULL,
  appointments_set integer NOT NULL,
  reschedules integer NOT NULL,
  cancellations integer NOT NULL,
  linkedin_messages integer NOT NULL,
  linkedin_connections integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE closer_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE setter_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on closer_entries"
  ON closer_entries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on closer_entries"
  ON closer_entries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access on setter_entries"
  ON setter_entries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on setter_entries"
  ON setter_entries FOR INSERT
  TO public
  WITH CHECK (true);

-- Update clean_old_entries function
CREATE OR REPLACE FUNCTION clean_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM fft_entries WHERE date < CURRENT_DATE;
  DELETE FROM eod_entries WHERE date < CURRENT_DATE;
  DELETE FROM closer_entries WHERE date < CURRENT_DATE;
  DELETE FROM setter_entries WHERE date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;