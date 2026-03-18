import { useReportsQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function Reports() {
  const { data, isLoading } = useReportsQuery();

  const reports = data?.reports || [
    { id: 1, title: "Vandalism at Central Park", crimeType: "Vandalism", status: "pending", createdAt: new Date().toISOString(), reporterId: 101, address: "Central Park West" },
    { id: 2, title: "Suspicious Activity Report", crimeType: "Suspicious", status: "investigating", createdAt: new Date(Date.now()-86400000).toISOString(), reporterId: 102, address: "Sector 9" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="text-primary w-6 h-6" /> Citizen Reports
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">User submitted incidents and tips</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search reports..." />
          </div>
          <Button><Plus className="w-4 h-4 mr-2" /> New</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-black/40 border-b border-white/5 font-mono">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title / Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-primary font-bold">RPT-{r.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">{r.crimeType}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{r.address}</td>
                    <td className="px-6 py-4 font-mono text-xs">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={r.status === 'investigating' ? 'warning' : r.status === 'resolved' ? 'success' : 'secondary'}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-primary">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
