// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Exercise = {
  id: string;
  user_id?: string;
  name: string;
  category: string;
  muscle_groups?: string;
  equipment?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  instructions?: string;
  created_at?: string;
  updated_at?: string;
};
