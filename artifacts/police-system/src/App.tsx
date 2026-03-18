import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

import { Layout } from "@/components/layout";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import CrimeMap from "@/pages/crime-map";
import Reports from "@/pages/reports";
import Alerts from "@/pages/alerts";
import FIRManagement from "@/pages/fir";
import FaceRecognition from "@/pages/face-recognition";
import Officers from "@/pages/officers";
import Cases from "@/pages/cases";
import Chatbot from "@/pages/chatbot";
import Surveillance from "@/pages/surveillance";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

function ProtectedRoutes() {
  const { user, isLoading, checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-primary tracking-widest uppercase">Initializing Nexus...</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/map" component={CrimeMap} />
        <Route path="/reports" component={Reports} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/cases" component={Cases} />
        <Route path="/fir" component={FIRManagement} />
        <Route path="/surveillance" component={Surveillance} />
        <Route path="/face-recognition" component={FaceRecognition} />
        <Route path="/officers" component={Officers} />
        <Route path="/chatbot" component={Chatbot} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ProtectedRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
