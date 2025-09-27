import { Clock, MessageCircle, Image, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Query } from "@/pages/Index";

interface QueryHistoryProps {
  queries: Query[];
}

export const QueryHistory = ({ queries }: QueryHistoryProps) => {
  const getQueryIcon = (type: Query['type']) => {
    switch (type) {
      case 'voice':
        return <Mic className="w-4 h-4 text-primary" />;
      case 'image':
        return <Image className="w-4 h-4 text-primary" />;
      default:
        return <MessageCircle className="w-4 h-4 text-primary" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="p-6 shadow-lg border-border animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground">Query History</h3>
      </div>
      
      {queries.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            No queries yet. Start by asking a question!
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {queries.map((query, index) => (
              <div 
                key={query.id} 
                className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-all duration-300 cursor-pointer hover-scale"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getQueryIcon(query.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {query.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(query.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {query.content}
                    </p>
                    
                    {query.response && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Response: {query.response.substring(0, 80)}...
                      </p>
                    )}
                    
                    {query.confidence && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 bg-muted rounded-full flex-1">
                            <div 
                              className="h-1 bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${query.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {query.confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};