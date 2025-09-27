import { Bot, CheckCircle, AlertCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { Query } from "@/pages/Index";

interface AIResponseProps {
  query: Query;
  isLoading: boolean;
}

export const AIResponse = ({ query, isLoading }: AIResponseProps) => {
  const { toast } = useToast();

  const handleEscalate = () => {
    toast({
      title: "Query escalated",
      description: "Your question has been forwarded to a local agricultural officer. They will contact you within 24 hours.",
    });
  };

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "Thank you for your feedback!" : "Feedback received",
      description: isPositive ? "This helps us improve our recommendations." : "We'll work to provide better answers.",
    });
  };

  if (isLoading) {
    return (
    <Card className="p-6 shadow-lg border-border animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground animate-fade-in">AI Analyzing Your Query...</h3>
            <p className="text-sm text-muted-foreground">Analyzing your query</p>
          </div>
        </div>
        <Progress value={65} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Processing agricultural data and weather information...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg border-border animate-fade-in">
      {/* AI Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
          <Bot className="w-6 h-6 text-success-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground animate-fade-in">AgriGuide AI Response</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Confidence: {query.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Query Display */}
      <div className="mb-4 p-3 bg-accent rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">Your Question:</p>
        <p className="text-foreground">{query.content}</p>
        {query.imageUrl && (
          <img 
            src={query.imageUrl} 
            alt="Query image" 
            className="mt-2 w-32 h-32 object-cover rounded-md border border-border"
          />
        )}
      </div>

      {/* AI Response */}
      <div className="mb-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {query.response}
          </p>
        </div>
      </div>

      {/* Confidence and Actions */}
      <div className="space-y-4">
        {query.confidence && query.confidence < 80 && (
          <div className="flex items-center gap-2 p-3 bg-warning/10 text-warning-foreground rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Low confidence response. Consider escalating to an expert.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleEscalate}
            className="border-border hover:bg-accent"
          >
            <Users className="w-4 h-4 mr-2" />
            Contact Agricultural Officer
          </Button>
          
          <div className="flex gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleFeedback(true)}
              className="border-border hover:bg-success/10 hover:text-success"
            >
              👍 Helpful
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleFeedback(false)}
              className="border-border hover:bg-destructive/10 hover:text-destructive"
            >
              👎 Not helpful
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};