import { createClient } from "@supabase/supabase-js";

/*
 * Run this SQL in the Supabase SQL editor:
 *
 * CREATE TABLE analyses (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id TEXT NOT NULL,
 *   file_name TEXT,
 *   risk_score INTEGER,
 *   risk_level TEXT,
 *   clauses_flagged INTEGER,
 *   hidden_penalties INTEGER,
 *   pages_scanned INTEGER,
 *   summary TEXT,
 *   eli18_summary TEXT,
 *   clauses JSONB,
 *   negotiation_tips JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
