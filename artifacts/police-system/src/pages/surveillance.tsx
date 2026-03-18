import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Maximize, AlertCircle } from "lucide-react";

export default function Surveillance() {
  const feeds = [
    { id: 1, name: "Sector 7 - Main Gate", active: true, threat: false },
    { id: 2, name: "Sector 7 - Alley", active: true, threat: true },
    { id: 3, name: "Downtown Square", active: true, threat: false },
    { id: 4, name: "Subway Ent B", active: true, threat: false },
    { id: 5, name: "Highway 95 Overpass", active: true, threat: false },
    { id: 6, name: "Port Terminal 4", active: false, threat: false },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Video className="text-primary w-6 h-6" /> Live Surveillance Net
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">CV models active: Weapon detection, Anomaly detection</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-mono text-success uppercase">All Systems Nominal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {feeds.map(feed => (
          <Card key={feed.id} className={`overflow-hidden border-2 flex flex-col ${feed.threat ? 'border-destructive shadow-[0_0_20px_rgba(239,68,68,0.2)]' : feed.active ? 'border-white/5' : 'border-dashed border-white/10 opacity-50'}`}>
            <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex justify-between items-center flex-shrink-0">
              <span className="font-mono text-xs text-white/80 uppercase">{feed.name}</span>
              <div className="flex gap-2 items-center">
                {feed.threat && <Badge variant="destructive" className="h-5 text-[10px] animate-pulse">THREAT DETECTED</Badge>}
                {!feed.active && <Badge variant="secondary" className="h-5 text-[10px]">OFFLINE</Badge>}
                <Maximize className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-white" />
              </div>
            </div>
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              {feed.active ? (
                <>
                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-[url('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80')] bg-cover bg-center grayscale"></div>
                  {/* Fake bounding box for threat */}
                  {feed.threat && (
                    <div className="absolute top-1/4 left-1/4 w-32 h-48 border-2 border-destructive animate-pulse">
                      <div className="absolute -top-6 left-0 bg-destructive text-white text-[10px] font-mono px-1">WEAPON: 89%</div>
                    </div>
                  )}
                  {/* Scanline */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(14,165,233,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none mix-blend-overlay"></div>
                  {/* Timestamp overlay */}
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/60">
                    {new Date().toISOString().replace('T', ' ').substring(0, 19)}
                  </div>
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-destructive flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping"></div> REC
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground font-mono text-sm flex flex-col items-center gap-2">
                  <AlertCircle className="w-6 h-6 opacity-50" />
                  NO SIGNAL
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
