import fs from 'node:fs';
import { isSupabaseConfigured } from '../src/lib/supabaseClient.js';

// 1. Verify schema file exists and contains essential tables and RLS
const sql = fs.readFileSync('supabase/schema.sql', 'utf-8');
const expectedPatterns = [
  'CREATE TABLE IF NOT EXISTS public.profiles',
  'CREATE TABLE IF NOT EXISTS public.user_progress',
  'CREATE TABLE IF NOT EXISTS public.user_stats',
  'ENABLE ROW LEVEL SECURITY',
  'CREATE POLICY',
  'on_auth_user_created'
];

for (const pattern of expectedPatterns) {
  if (!sql.includes(pattern)) {
    console.error(`FAIL: schema.sql missing pattern: "${pattern}"`);
    process.exit(1);
  }
}

// 2. Verify client fallback
if (isSupabaseConfigured !== false && !process.env.VITE_SUPABASE_URL) {
  console.error('FAIL: Expected isSupabaseConfigured to be false when env is not set');
  process.exit(1);
}

console.log('PASS: Supabase schema and client fallback verified successfully.');
process.exit(0);
