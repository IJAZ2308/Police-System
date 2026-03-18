import { useCasesQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function Cases() {
  const { data, isLoading } = useCasesQuery();

  const cases = data?.cases || [
    { id: 1, caseNumber: "CAS-9982", title: "Downtown Bank Heist", crimeType: "Robbery", status: "investigating", priority: "critical", assignedOfficerName: "Det. Miller", createdAt: new Date().toISOString() },
    { id: 2, caseNumber: "CAS-9983", title: "Vehicle Theft Sector 4", crimeType: "Theft", status: "open", priority: "medium", assignedOfficerName: "Off. Sarah", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, caseNumber: "CAS-9970", title: "Assault behind subway", crimeType: "Assault", status: "closed", priority: "high", assignedOfficerName: "Det. Miller", createdAt: new Date(Date.now() - 864000000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="text-primary w-6 h-6" /> Case Directory
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">Active and archived investigations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button size="sm">Open New Case</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Columns to simulate board */}
        {['open', 'investigating', 'closed'].map(status => (
          <div key={status} className="bg-black/20 rounded-xl p-4 border border-white/5 h-[calc(100vh-12rem)] overflow-auto">
            <h3 className="font-display font-bold text-white uppercase tracking-widest mb-4 flex justify-between items-center">
              {status}
              <Badge variant="secondary" className="bg-black/40">{cases.filter((c:any) => c.status === status).length}</Badge>
            </h3>
            
            <div className="space-y-4">
              {cases.filter((c:any) => c.status === status).map((c:any) => (
                <Card key={c.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-primary font-bold">{c.caseNumber}</span>
                      <Badge variant={c.priority === 'critical' ? 'destructive' : c.priority === 'high' ? 'warning' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {c.priority}
                      </Badge>
                    </div>
                    <h4 className="text-white font-medium mb-1 leading-tight">{c.title}</h4>
                    <p className="text-xs text-muted-foreground font-mono mb-4">{c.crimeType}</p>
                    
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {c.assignedOfficerName || "Unassigned"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(c.createdAt).split(',')[0]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
