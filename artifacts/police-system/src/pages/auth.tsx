import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Fingerprint, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("admin@nexus.gov");
  const [password, setPassword] = useState("admin123");
  const [name, setName] = useState("");
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, name, role: "citizen" });
      }
    } catch (err: any) {
      const apiMessage =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.body?.message ||
        err?.message ||
        "Request failed. Try again.";
      toast({
        title: isLogin ? "Authentication Failed" : "Registration Failed",
        description: apiMessage,
        variant: "destructive"
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(prev => {
      const next = !prev;
      if (next) {
        setEmail("admin@nexus.gov");
        setPassword("admin123");
      } else {
        setEmail("");
        setPassword("");
        setName("");
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-black overflow-hidden">
      {/* Background Image */}
      <img 
        src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
        alt="Command Center" 
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 glass-panel border border-primary/20 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.15)]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-full h-full object-contain p-3" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-widest text-white">NEXUS</h1>
          <p className="text-primary font-mono text-sm uppercase tracking-widest mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Officer Name</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Clearance ID (Email)</label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="email" required className="pl-10" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nexus.gov" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="password" required className="pl-10" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 mt-6 text-lg">
            {isLogin ? "Initialize Uplink" : "Request Clearance"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={toggleMode}
            className="text-xs font-mono text-muted-foreground hover:text-primary uppercase tracking-wider"
          >
            {isLogin ? "No clearance? Register here" : "Already authorized? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
