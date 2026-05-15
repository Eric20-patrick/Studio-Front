import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminPageSkeleton() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center p-8">
      <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl w-full"></div>
          ))}
        </div>

        <div className="w-full h-64 bg-muted rounded-xl"></div>
        
        <div className="flex items-center gap-2 mt-4 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Carregando interface...</span>
        </div>
      </div>
    </div>
  );
}
