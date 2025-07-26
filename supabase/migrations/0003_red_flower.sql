/*
  # Update Closer Report Schema

  1. New Tables
    - `closer_daily_reports`
      - Basic info fields (name, role, date)
      - Call statistics
      - Sales metrics
      - Meeting attendance
      - Notes and achievements

  2. Security
    - Enable RLS
    - Add policies for public access
*/

CREATE TABLE IF NOT EXISTS closer_daily_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  
  -- Call Statistics
  total_calls_scheduled integer NOT NULL,
  calls_completed integer NOT NULL,
  followup_calls_scheduled integer NOT NULL,
  
  -- Sales Metrics
  revenue_generated decimal(10,2) NOT NULL,
  cash_collected decimal(10,2) NOT NULL,
  deposits decimal(10,2) NOT NULL,
  followup_actions text,
  
  -- Meeting Attendance
  sales_team_meetings integer NOT NULL,
  leadership_meetings integer NOT NULL,
  training_sessions integer NOT NULL,
  
  -- Notes
  challenges text,
  achievements text,
  next_day_priorities text,
  
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE closer_daily_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on closer_daily_reports"
  ON closer_daily_reports FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on closer_daily_reports"
  ON closer_daily_reports FOR INSERT
  TO public
  WITH CHECK (true);

-- Update clean_old_entries function
CREATE OR REPLACE FUNCTION clean_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM closer_daily_reports WHERE date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;