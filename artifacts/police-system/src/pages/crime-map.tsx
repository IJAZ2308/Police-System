import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { usePredictCrimeQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Set center to a generic city (New York) for demo
const CENTER: [number, number] = [40.7128, -74.0060];

function HeatmapLayer({ data }: { data: any[] }) {
  return (
    <>
      {data.map((point, i) => {
        const color = point.riskLevel === 'critical' ? '#ef4444' : 
                      point.riskLevel === 'high' ? '#f97316' : 
                      point.riskLevel === 'medium' ? '#eab308' : '#22c55e';
        return (
          <CircleMarker
            key={i}
            center={[point.lat, point.lng]}
            radius={point.intensity * 20}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: 2 }}
          >
            <Popup className="custom-popup">
              <div className="bg-card text-card-foreground p-2 rounded border border-border">
                <h4 className="font-display font-bold uppercase">{point.crimeType}</h4>
                <p className="text-sm text-muted-foreground font-mono mt-1">Risk: {point.riskLevel}</p>
                <p className="text-xs mt-2 text-primary">{point.predictedTime}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default function CrimeMap() {
  const { data, isLoading } = usePredictCrimeQuery();
  
  // Mock data fallback
  const mapData = data?.heatmapData || [
    { lat: 40.7128, lng: -74.0060, intensity: 0.8, crimeType: "Robbery", riskLevel: "high", predictedTime: "22:00 - 02:00" },
    { lat: 40.7200, lng: -73.9900, intensity: 0.9, crimeType: "Assault", riskLevel: "critical", predictedTime: "23:00 - 04:00" },
    { lat: 40.7050, lng: -74.0150, intensity: 0.4, crimeType: "Theft", riskLevel: "medium", predictedTime: "14:00 - 18:00" },
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Predictive Crime Map</h2>
          <p className="text-muted-foreground text-sm font-mono">AI-driven hotspot forecasting</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive">Critical Risk</Badge>
          <Badge variant="warning" className="bg-orange-500/20 text-orange-500 border-orange-500/30">High Risk</Badge>
          <Badge variant="success">Low Risk</Badge>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden p-0 border-primary/20 shadow-[0_0_30px_rgba(14,165,233,0.1)] relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-primary font-mono animate-pulse">Calibrating Map Data...</div>
          </div>
        )}
        <div className="absolute inset-0 scanner-overlay pointer-events-none z-40 mix-blend-overlay opacity-30 bg-[linear-gradient(transparent_0%,rgba(14,165,233,0.2)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline"></div>
        <MapContainer center={CENTER} zoom={13} className="w-full h-full bg-background z-10" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer data={mapData} />
        </MapContainer>
      </Card>
    </div>
  );
}
