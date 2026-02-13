-- Smart Bookmark App - Supabase Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Create the bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies (users can only access their own bookmarks)
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 4. Enable Realtime for the bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

-- 5. Create an index for faster queries
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at DESC);
