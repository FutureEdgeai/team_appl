/*
  # Update Setter Entries Table

  1. Changes
    - Remove `no_shows` column from `setter_entries` table
  
  2. Security
    - Preserves existing RLS policies
*/

-- First, check if the column exists before trying to drop it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'setter_entries' 
    AND column_name = 'no_shows'
  ) THEN
    ALTER TABLE setter_entries DROP COLUMN no_shows;
  END IF;
END $$;