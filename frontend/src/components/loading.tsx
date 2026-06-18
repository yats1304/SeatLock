import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative flex items-center justify-center">
        {/* Soft glowing background effect */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full h-16 w-16" />
        
        <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground animate-pulse">
          SeatLock
        </h2>
        <p className="text-sm text-muted-foreground">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}
