import { KanbanView } from "@/views/kanban-view";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
import { OTPForm } from "@/components/otp-form";
import { useState } from "react";
import { supabase } from "./lib/supabase";
import { createConnectTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";

const finalTransport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL,
  interceptors: [
    (next) => async (req) => {
      const { session } = useAuthStore.getState();
      if (session?.access_token) {
        req.header.set("Authorization", `Bearer ${session.access_token}`);
      }
      return next(req);
    },
  ],
});

const queryClient = new QueryClient();

function App() {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const session = useAuthStore((state) => state.session);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowOTP(false);
  };

  const getView = () => {
    if (session) {
      return <KanbanView />;
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
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Header isLoggedIn={!!session} onLogout={handleLogout} />
          {getView()}
        </ThemeProvider>
      </QueryClientProvider>
    </TransportProvider>
  );
}

export default App;
