import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  setAuth: (session: Session | null) => void;
}

// Create a single promise for auth initialization - called only once
export const authInitPromise = supabase.auth
  .getSession()
  .then(({ data: { session } }) => session);

export const useAuthStore = create<AuthState>((set) => {
  // Subscribe to auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null, session });
  });

  // Initialize with current session
  authInitPromise.then((session) => {
    set({ user: session?.user ?? null, session });
  });

  return {
    user: null,
    session: null,
    setAuth: (session) => set({ user: session?.user ?? null, session }),
  };
});
