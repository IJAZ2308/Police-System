import { useState } from "react";
import { useGenerateFirMutation, useFirsQuery } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileEdit, BrainCircuit, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FIRManagement() {
  const [description, setDescription] = useState("");
  const [complainantName, setComplainantName] = useState("");
  const [crimeType, setCrimeType] = useState("");
  
  const generateFir = useGenerateFirMutation();
  const { data } = useFirsQuery();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateFir.mutate({ description, complainantName, crimeType });
  };

  const generatedFir = generateFir.data?.fir;
  const pastFirs = data?.firs || [
    { id: 101, firNumber: "FIR-2023-0891", crimeType: "Theft", complainantName: "John Doe", status: "filed", createdAt: new Date().toISOString() }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6 flex flex-col">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit className="text-primary w-6 h-6" /> AI FIR Generation
          </h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">NLP-based automated legal drafting</p>
        </div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Complainant Name</label>
                  <Input required value={complainantName} onChange={e => setComplainantName(e.target.value)} placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Crime Category</label>
                  <Input required value={crimeType} onChange={e => setCrimeType(e.target.value)} placeholder="e.g. Assault, Theft" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">Raw Incident Description (Audio Transcript / Text)</label>
                <textarea 
                  required
                  className="w-full h-40 bg-black/20 border border-white/10 rounded-md p-3 text-sm text-white font-mono focus:outline-none focus:border-primary resize-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what happened in natural language..."
                />
              </div>
              <Button type="submit" disabled={generateFir.isPending} className="w-full h-12">
                {generateFir.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FileEdit className="w-5 h-5 mr-2" />}
                {generateFir.isPending ? "PROCESSING NLP MODEL..." : "GENERATE STRUCTURED FIR"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 flex flex-col">
        {generatedFir ? (
          <Card className="border-primary/50 shadow-[0_0_30px_rgba(14,165,233,0.1)] flex-1 bg-primary/5">
            <CardHeader className="border-b border-white/5 bg-black/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary">Draft: {generatedFir.firNumber}</CardTitle>
                <Badge variant="outline" className="border-primary text-primary">AI GENERATED</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-mono text-sm overflow-y-auto max-h-[600px]">
              <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded border border-white/5">
                <div><span className="text-muted-foreground">Complainant:</span> <span className="text-white">{generatedFir.complainantName}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="text-white">{generatedFir.crimeType}</span></div>
              </div>
              
              <div>
                <h4 className="text-primary mb-2 font-display uppercase tracking-widest text-base">Suggested IPC Sections</h4>
                <div className="flex flex-wrap gap-2">
                  {(generatedFir.ipcSections || ["IPC 378", "IPC 379"]).map(ipc => (
                    <Badge key={ipc} variant="secondary">{ipc}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-primary mb-2 font-display uppercase tracking-widest text-base">Structured Summary</h4>
                <p className="text-white/80 leading-relaxed bg-black/40 p-4 rounded border border-white/5">
                  {generatedFir.summary || description}
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button className="flex-1">File Official FIR</Button>
                <Button variant="outline" onClick={() => generateFir.reset()} className="flex-1">Discard</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Recent FIR Database</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-3">
                {pastFirs.map((fir: any) => (
                  <div key={fir.id} className="p-4 bg-black/20 border border-white/5 rounded-lg flex justify-between items-center hover:border-primary/30 transition-colors cursor-pointer">
                    <div>
                      <p className="font-display font-bold text-white uppercase tracking-wider">{fir.firNumber}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{fir.crimeType} • {fir.complainantName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={fir.status === 'filed' ? 'success' : 'secondary'}>{fir.status}</Badge>
                      <p className="text-[10px] text-muted-foreground font-mono mt-2">{formatDate(fir.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
