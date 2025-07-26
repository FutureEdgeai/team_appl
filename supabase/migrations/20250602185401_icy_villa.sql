/*
  # Create FFT entries table

  1. New Tables
    - `fft_entries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `tasks` (jsonb)
      - `created_at` (timestamp)
      - `date` (date)
  
  2. Security
    - Enable RLS
    - Add policies for public access
*/

CREATE TABLE IF NOT EXISTS fft_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  tasks jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  date date DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE fft_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on fft_entries" ON fft_entries;
  DROP POLICY IF EXISTS "Allow public write access on fft_entries" ON fft_entries;
END $$;

-- Create policies
CREATE POLICY "Allow public read access on fft_entries"
  ON fft_entries
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public write access on fft_entries"
  ON fft_entries
  FOR INSERT
  TO public
  WITH CHECK (true);