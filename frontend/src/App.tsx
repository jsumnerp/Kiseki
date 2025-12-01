import { KanbanView } from "@/views/kanban-view";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";
import { OTPForm } from "@/components/otp-form";
import { useState, Suspense, use } from "react";
import { supabase } from "./lib/supabase";
import { createConnectTransport } from "@connectrpc/connect-web";
import { TransportProvider } from "@connectrpc/connect-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore, authInitPromise } from "@/stores/auth-store";

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

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  // This suspends until auth is initialized
  use(authInitPromise);

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
    <>
      <Header isLoggedIn={!!session} onLogout={handleLogout} />
      {getView()}
    </>
  );
}

function App() {
  return (
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Suspense fallback={<LoadingFallback />}>
            <AuthenticatedApp />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    </TransportProvider>
  );
}

export default App;
