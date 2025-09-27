import { useState, useRef } from "react";
import { Mic, Camera, Send, Image, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Query } from "@/pages/Index";

interface QueryInterfaceProps {
  onQuerySubmit: (query: Omit<Query, 'id' | 'timestamp'>) => void;
  isLoading: boolean;
}

export const QueryInterface = ({ onQuerySubmit, isLoading }: QueryInterfaceProps) => {
  const [queryText, setQueryText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTextSubmit = () => {
    if (!queryText.trim() && !uploadedImage) return;
    
    onQuerySubmit({
      type: uploadedImage ? 'image' : 'text',
      content: queryText || "Image analysis requested",
      imageUrl: uploadedImage || undefined,
    });
    
    setQueryText("");
    setUploadedImage(null);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Processing your voice query...",
      });
      
      // Simulate voice processing
      setTimeout(() => {
        onQuerySubmit({
          type: 'voice',
          content: "What are these spots on my banana plant leaves? What pesticide should I use?",
        });
      }, 1500);
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your agricultural question clearly...",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-border animate-fade-in">
      <div className="space-y-4">
        {/* Image Upload Preview */}
        {uploadedImage && (
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded crop" 
              className="w-full max-w-md mx-auto rounded-lg object-cover h-48"
            />
            <Button 
              variant="destructive" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => setUploadedImage(null)}
            >
              Remove
            </Button>
          </div>
        )}
        
        {/* Text Input */}
        <Textarea
          placeholder="Type your agricultural question here... (e.g., 'My tomato plants have yellow spots on leaves, what should I do?')"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="min-h-[100px] resize-none border-border focus:border-primary transition-all duration-300"
          disabled={isLoading}
        />
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="border-border hover:bg-accent hover-scale transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`border-border hover:bg-accent hover-scale transition-all duration-300 ${isRecording ? 'bg-destructive text-destructive-foreground animate-pulse' : ''}`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button 
            onClick={handleTextSubmit}
            disabled={isLoading || (!queryText.trim() && !uploadedImage)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 hover-scale transition-all duration-300"
          >
            {isLoading ? "Processing..." : "Send Query"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-destructive">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording... Click mic to stop</span>
          </div>
        )}
      </div>
    </Card>
  );
};