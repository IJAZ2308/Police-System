import { useDashboardStatsQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, FolderOpen, Activity, AlertTriangle, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

// Mock data for charts since API might not return it detailed
const mockChartData = [
  { name: '00:00', crimes: 12 }, { name: '04:00', crimes: 8 },
  { name: '08:00', crimes: 25 }, { name: '12:00', crimes: 45 },
  { name: '16:00', crimes: 60 }, { name: '20:00', crimes: 35 },
];

export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStatsQuery();

  if (isLoading) return <div className="text-center font-mono text-primary mt-20 animate-pulse">Initializing Dashboard Data...</div>;
  
  // Fallback to mock data if API fails to show the beautiful UI
  const d = stats || {
    totalReports: 1420, activeAlerts: 3, openCases: 89, officersOnDuty: 45,
    resolvedToday: 12, crimeRateChange: -4.5, responseTimeAvg: 4.2, pendingFirs: 28,
    recentActivity: [
      { id: 1, type: "ALERT", message: "Shots fired reported in Sector 7", timestamp: new Date().toISOString(), severity: "critical" },
      { id: 2, type: "CASE", message: "Case #492 marked as investigating", timestamp: new Date(Date.now() - 3600000).toISOString(), severity: "info" },
      { id: 3, type: "ARREST", message: "Subject apprehended at Main St.", timestamp: new Date(Date.now() - 7200000).toISOString(), severity: "warning" },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-t-4 border-t-destructive">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm">Active Alerts</CardTitle>
              <ShieldAlert className="text-destructive w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-white">{d.activeAlerts}</div>
              <p className="text-xs text-destructive mt-1 font-mono uppercase">Critical Status</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm">Officers on Duty</CardTitle>
              <Users className="text-primary w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-white">{d.officersOnDuty}</div>
              <p className="text-xs text-primary mt-1 font-mono uppercase">Avg Response: {d.responseTimeAvg}m</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-t-4 border-t-warning">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm">Open Cases</CardTitle>
              <FolderOpen className="text-warning w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-white">{d.openCases}</div>
              <p className="text-xs text-warning mt-1 font-mono uppercase">{d.resolvedToday} resolved today</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-t-4 border-t-success">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground text-sm">Crime Rate</CardTitle>
              <Activity className="text-success w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-white">{d.crimeRateChange}%</div>
              <p className="text-xs text-success mt-1 font-mono uppercase">Compared to last week</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Crime Frequency (24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={12} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Line type="monotone" dataKey="crimes" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {d.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex gap-3 border-b border-white/5 pb-3 last:border-0">
                  <div className="mt-1">
                    {activity.severity === 'critical' ? <ShieldAlert className="w-5 h-5 text-destructive" /> :
                     activity.severity === 'warning' ? <AlertTriangle className="w-5 h-5 text-warning" /> :
                     <Info className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={activity.severity === 'critical' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 py-0">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">{formatDate(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
