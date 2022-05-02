import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'this is dammy url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'this is dammy key';
console.log(supabaseUrl);
console.log(supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
