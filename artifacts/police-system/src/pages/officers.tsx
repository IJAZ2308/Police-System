import { useOfficersQuery } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, MapPin } from "lucide-react";

export default function Officers() {
  const { data } = useOfficersQuery();

  const officers = data?.officers || [
    { id: 1, name: "Sgt. Sarah Connor", badgeNumber: "B-4921", rank: "Sergeant", status: "on_duty", department: "Homicide", activeCases: 3 },
    { id: 2, name: "Det. James Miller", badgeNumber: "B-1184", rank: "Detective", status: "on_duty", department: "Cyber", activeCases: 5 },
    { id: 3, name: "Off. Marcus Wright", badgeNumber: "B-3390", rank: "Officer", status: "off_duty", department: "Patrol", activeCases: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Users className="text-primary w-6 h-6" /> Officer Roster
        </h2>
        <p className="text-muted-foreground text-sm font-mono mt-1">Personnel tracking and deployment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officers.map((o: any) => (
          <Card key={o.id} className="relative overflow-hidden group">
            {o.status === 'on_duty' && <div className="absolute top-0 left-0 w-full h-1 bg-success shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary border border-white/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white uppercase">{o.name}</h3>
                    <p className="text-primary font-mono text-sm">{o.badgeNumber} • {o.rank}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 bg-black/40 p-4 rounded-lg border border-white/5">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-muted-foreground uppercase text-xs">Status</span>
                  <Badge variant={o.status === 'on_duty' ? 'success' : 'secondary'} className="text-[10px]">
                    {o.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-muted-foreground uppercase text-xs">Department</span>
                  <span className="text-white">{o.department}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-muted-foreground uppercase text-xs">Active Cases</span>
                  <span className="text-white">{o.activeCases}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
