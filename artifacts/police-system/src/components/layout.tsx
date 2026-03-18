import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShieldAlert, LayoutDashboard, Map as MapIcon, FileText, 
  Siren, FileEdit, ScanFace, Users, Briefcase, Bot, Video, LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Crime Map", icon: MapIcon },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/alerts", label: "Emergency Alerts", icon: Siren },
  { href: "/cases", label: "Active Cases", icon: Briefcase },
  { href: "/fir", label: "FIR Automation", icon: FileEdit },
  { href: "/surveillance", label: "Surveillance", icon: Video },
  { href: "/face-recognition", label: "Face Scan", icon: ScanFace },
  { href: "/officers", label: "Officers", icon: Users },
  { href: "/chatbot", label: "AI Assist", icon: Bot },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/5 flex flex-col flex-shrink-0 z-10 relative">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
          <div>
            <h1 className="font-display font-bold text-xl tracking-widest text-primary">NEXUS</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Police Command</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[inset_0_0_15px_rgba(14,165,233,0.2)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" : "")} />
                <span className="font-display uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 bg-black/40 rounded-lg border border-white/5 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-display uppercase tracking-widest">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        {/* Subtle grid background overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <h2 className="font-display uppercase tracking-widest text-lg font-semibold text-white/90">
            {NAV_ITEMS.find(i => i.href === location)?.label || "Nexus System"}
          </h2>
          <div className="flex items-center gap-4">
            <Link href="/alerts" className="relative group">
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
              <Siren className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors" />
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
