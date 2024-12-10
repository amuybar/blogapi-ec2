import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.API_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
