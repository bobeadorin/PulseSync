import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iewebbjgjxcmwxgycsvu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlld2ViYmpnanhjbXd4Z3ljc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mzg4ODMsImV4cCI6MjA2MzMxNDg4M30.1Nc6h0H1d1ONusgpdsRMVk9XHzcf80qn4aF8RtqKu7k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
