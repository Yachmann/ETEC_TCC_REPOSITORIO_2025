import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nqtjvyliouaxzuqmfwsr.supabase.co"; // Substitua pela URL do seu projeto
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdGp2eWxpb3VheHp1cW1md3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzMzNzUsImV4cCI6MjA1NjE0OTM3NX0.uwHHVj2L-UubL2NlOOGqIRsaMhp0JXrx4vveFINIRxc"; // Substitua pela sua chave

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
