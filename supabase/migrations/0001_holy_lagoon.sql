/*
  # Task Management Schema Setup

  1. New Tables
    - `fft_entries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `tasks` (jsonb array)
      - `created_at` (timestamp)
      - `date` (date)
    
    - `eod_entries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `accomplished_tasks` (jsonb array)
      - `pending_tasks` (jsonb array)
      - `blockers` (text)
      - `created_at` (timestamp)
      - `date` (date)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (read/write) since we're not implementing authentication
*/

-- Create FFT entries table
CREATE TABLE IF NOT EXISTS fft_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  tasks jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Create EOD entries table
CREATE TABLE IF NOT EXISTS eod_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  accomplished_tasks jsonb NOT NULL,
  pending_tasks jsonb NOT NULL,
  blockers text,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Enable RLS
ALTER TABLE fft_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE eod_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on fft_entries"
  ON fft_entries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on fft_entries"
  ON fft_entries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access on eod_entries"
  ON eod_entries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on eod_entries"
  ON eod_entries FOR INSERT
  TO public
  WITH CHECK (true);

-- Create function to clean old entries
CREATE OR REPLACE FUNCTION clean_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM fft_entries WHERE date < CURRENT_DATE;
  DELETE FROM eod_entries WHERE date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;