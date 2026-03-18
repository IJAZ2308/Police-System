import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="glass-panel p-12 text-center max-w-md w-full border border-destructive/20 rounded-2xl">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-display font-bold text-white tracking-widest mb-2 uppercase">404 Error</h1>
        <p className="text-muted-foreground font-mono mb-8">Access denied or sector not found in Nexus directory.</p>
        <Link href="/">
          <Button className="w-full">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
