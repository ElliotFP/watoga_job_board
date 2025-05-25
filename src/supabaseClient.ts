import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yexjyyemagfobogoeuba.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlleGp5eWVtYWdmb2JvZ29ldWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjQyMDgsImV4cCI6MjA2MzU0MDIwOH0.FMDDo3Bv8GA3M7q6eHS17r7Idkk1FmEQLvtmU2tBul4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 