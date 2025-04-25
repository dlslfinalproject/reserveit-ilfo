import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mhhkplnlvrlcglqpcpnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oaGtwbG5sdnJsY2dscXBjcG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MTAyMjUsImV4cCI6MjA2MDI4NjIyNX0.YuYP09-K6JliGFe7N5NPeCS0pcua3qfAG2VesvwkifU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
