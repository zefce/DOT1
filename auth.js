import { supabase } from './supabase.js';

export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('[DOT] Registration error:', error);
    throw error;
  }
  return data;
}

export async function signInWithEmailPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('[DOT] Login error:', error);
    throw error;
  }
  return data;
}