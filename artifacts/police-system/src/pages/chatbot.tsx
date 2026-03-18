import { useState, useRef, useEffect } from "react";
import { useChatbotMutation } from "@/hooks/use-api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Send, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Nexus Legal AI initialized. How can I assist you with legal queries, procedural guidelines, or FIR drafting today?" }
  ]);
  const chatMutation = useChatbotMutation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    try {
      const res = await chatMutation.mutateAsync({ message: userMsg, context: "legal" });
      setMessages(prev => [...prev, { role: 'ai', text: res.reply }]);
    } catch {
      // Mock fallback
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: "Based on the IPC, the relevant sections for this query are 378 (Theft) and 420 (Cheating). For official procedures, please refer to the standard operations manual section 4.B." }]);
      }, 1000);
    }
  };

  const suggestions = ["How to file FIR?", "Rights during arrest", "IPC for Cybercrime", "Bail procedure"];

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scale className="text-primary w-6 h-6" /> Legal & Procedural AI
        </h2>
        <p className="text-muted-foreground text-sm font-mono mt-1">Secure queries against national legal databases</p>
      </div>

      <Card className="flex-1 flex flex-col border-primary/20 shadow-[0_0_20px_rgba(14,165,233,0.05)]">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn("w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1", msg.role === 'ai' ? "bg-primary/20 border border-primary/50 text-primary" : "bg-secondary border border-white/10 text-white")}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={cn("p-4 rounded-lg text-sm font-mono leading-relaxed", msg.role === 'user' ? "bg-primary/20 text-white border border-primary/30" : "bg-black/40 text-white/90 border border-white/5")}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1 bg-primary/20 border border-primary/50 text-primary">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/5 text-primary text-sm font-mono animate-pulse">
                Accessing legal framework...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>
        
        <CardFooter className="flex-col gap-4 border-t border-white/5 bg-black/20 p-4">
          <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map(s => (
              <Badge key={s} variant="outline" className="cursor-pointer hover:bg-primary/20 whitespace-nowrap" onClick={() => setInput(s)}>
                {s}
              </Badge>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 w-full">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Query the Nexus database..." 
              className="flex-1 h-12 bg-black/40 font-sans"
            />
            <Button type="submit" disabled={chatMutation.isPending || !input.trim()} className="h-12 px-6">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
