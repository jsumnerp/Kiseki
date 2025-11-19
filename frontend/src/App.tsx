import { Kanban } from "@/components/kanban";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
import { OTPForm } from "@/components/otp-form";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const getView = () => {
    console.log(session);
    if (session) {
      return <Kanban />;
    } else if (showOTP) {
      return <OTPForm email={email} handleGoBack={() => setShowOTP(false)} />;
    } else {
      return (
        <LoginForm
          onLogin={(email) => {
            setEmail(email);
            setShowOTP(true);
          }}
        />
      );
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header isLoggedIn={!!session} onLogout={handleLogout} />
      {getView()}
    </ThemeProvider>
  );
}

export default App;
