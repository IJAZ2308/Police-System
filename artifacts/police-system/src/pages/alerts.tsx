import { useAlertsQuery, useSendAlertMutation, useResolveAlertMutation } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, Crosshair, MapPin, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const { data, isLoading } = useAlertsQuery();
  const sendAlert = useSendAlertMutation();
  const resolveAlert = useResolveAlertMutation();
  const { toast } = useToast();

  const handlePanic = () => {
    sendAlert.mutate({
      type: "panic",
      latitude: 40.7128,
      longitude: -74.0060,
      message: "OFFICER IN DISTRESS",
      address: "Unknown Location"
    }, {
      onSuccess: () => {
        toast({ title: "ALERT BROADCASTED", description: "All units notified.", variant: "destructive" });
      }
    });
  };

  // Mock data fallback
  const alerts = data?.alerts || [
    { id: 1, type: "weapon", status: "active", latitude: 40.71, longitude: -74.00, address: "125 Main St", message: "Armed robbery in progress", createdAt: new Date().toISOString() },
    { id: 2, type: "panic", status: "dispatched", latitude: 40.72, longitude: -73.98, address: "Sector 4", message: "Officer requires backup", createdAt: new Date(Date.now() - 300000).toISOString() },
  ];

  return (
    <div className="space-y-8">
      {/* BIG PANIC BUTTON */}
      <div className="flex justify-center py-8 border-b border-white/5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePanic}
          className="relative group rounded-full"
        >
          <div className="absolute inset-0 bg-destructive rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-[-20px] bg-destructive/20 rounded-full blur-xl group-hover:bg-destructive/40 transition-all"></div>
          <div className="relative w-48 h-48 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-4 border-red-900 shadow-[0_0_50px_rgba(239,68,68,0.6)] flex flex-col items-center justify-center text-white cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.3),transparent_50%)]"></div>
            <Siren className="w-16 h-16 mb-2 drop-shadow-md" />
            <span className="font-display font-bold text-2xl uppercase tracking-widest drop-shadow-md">Panic</span>
          </div>
        </motion.button>
      </div>

      <div>
        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Crosshair className="text-primary w-5 h-5" /> Active Emergency Feeds
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-mono animate-pulse">Scanning frequencies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {alerts.map((alert: any) => (
                <motion.div key={alert.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Card className={alert.type === 'panic' ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-warning/50'}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={alert.type === 'panic' ? 'destructive' : 'warning'} className="text-sm px-3 py-1 animate-pulse">
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{formatDate(alert.createdAt)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-lg font-medium text-white">{alert.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-black/40 p-2 rounded border border-white/5">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-mono">{alert.address}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {alert.status !== 'resolved' ? (
                        <Button 
                          variant="outline" 
                          className="w-full text-success hover:bg-success hover:text-white border-success/30"
                          onClick={() => resolveAlert.mutate({ id: alert.id })}
                          disabled={resolveAlert.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> 
                          {resolveAlert.isPending ? "Resolving..." : "Mark Resolved"}
                        </Button>
                      ) : (
                        <Badge variant="success" className="w-full justify-center">Resolved</Badge>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
