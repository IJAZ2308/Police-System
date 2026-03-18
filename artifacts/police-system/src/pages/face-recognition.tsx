import { useState } from "react";
import { useMatchFaceMutation } from "@/hooks/use-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanFace, UploadCloud, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FaceRecognition() {
  const [image, setImage] = useState<string | null>(null);
  const matchMutation = useMatchFaceMutation();

  const handleSimulateUpload = () => {
    // Fake image loaded
    setImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80");
  };

  const handleScan = () => {
    matchMutation.mutate({ imageBase64: "dummy" });
  };

  const result = matchMutation.data?.matches?.[0] || (matchMutation.isSuccess ? {
    name: "Alex V.", age: 34, status: "wanted", confidence: 94.2, criminalRecord: "Armed Robbery, Grand Theft", lastKnownLocation: "Sector 4"
  } : null);

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ScanFace className="text-primary w-6 h-6" /> Biometric Analysis
        </h2>
        <p className="text-muted-foreground text-sm font-mono mt-1">Cross-referencing global criminal database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <Card className="flex flex-col border-dashed border-2 border-white/10 hover:border-primary/50 transition-colors bg-black/20">
          <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            {image ? (
              <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-white/10">
                <img src={image} alt="Target" className="w-full h-auto grayscale contrast-125" />
                {matchMutation.isPending && (
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(14,165,233,0.4)_50%,transparent_100%)] bg-[length:100%_10px] animate-scanline mix-blend-overlay"></div>
                )}
                {matchMutation.isSuccess && (
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-primary border-t-0 border-b-0 animate-pulse"></div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground cursor-pointer" onClick={handleSimulateUpload}>
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-2">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-display uppercase tracking-widest text-lg">Click to Upload Subject Photo</p>
                <p className="text-xs font-mono">JPG, PNG, WebP (Max 5MB)</p>
              </div>
            )}
            
            {image && (
              <div className="mt-8 flex gap-4 w-full justify-center">
                <Button onClick={handleScan} disabled={matchMutation.isPending} className="w-48 h-12">
                  {matchMutation.isPending ? "ANALYZING..." : "INITIATE SCAN"}
                </Button>
                <Button variant="outline" onClick={() => {setImage(null); matchMutation.reset()}} className="h-12">Clear</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden transition-all duration-500 ${result ? 'border-primary/50 shadow-[0_0_30px_rgba(14,165,233,0.1)]' : 'border-white/5'}`}>
          {!result && !matchMutation.isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground font-mono bg-black/60 z-10 backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              AWAITING BIOMETRIC DATA
            </div>
          )}
          {matchMutation.isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary font-mono bg-black/60 z-10">
              <ScanFace className="w-12 h-12 mb-4 animate-ping" />
              QUERYING INTERPOL / NEXUS...
            </div>
          )}
          
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
              <div className="p-6 bg-primary/10 border-b border-primary/20 flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-widest">{result.name}</h3>
                  <p className="text-primary font-mono mt-1">MATCH: {result.confidence}%</p>
                </div>
                <Badge variant={result.status === 'wanted' ? 'destructive' : 'secondary'} className="text-lg py-1 px-4">
                  {result.status}
                </Badge>
              </div>
              <div className="p-6 space-y-6 flex-1 bg-black/40">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase mb-1">Age</p>
                    <p className="text-lg text-white font-mono">{result.age} yrs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase mb-1">Last Location</p>
                    <p className="text-lg text-white font-mono">{result.lastKnownLocation}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Criminal Record</p>
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded text-destructive font-mono text-sm">
                    {result.criminalRecord}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5">
                <Button variant="destructive" className="w-full">ISSUE APPREHENSION ORDER</Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
