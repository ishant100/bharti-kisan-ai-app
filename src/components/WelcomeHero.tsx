import { Leaf, MessageSquare, Camera, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-agriculture.jpg";

export const WelcomeHero = () => {
  const navigate = useNavigate();

  // ✅ Voice input (Web Speech API)
  const handleVoiceInput = () => {
    const SR: any =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) {
      alert("Your browser does not support speech recognition. Please use Chrome/Edge.");
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Redirect to chat with transcript as query
      navigate("/chat", { state: { type: "text", content: transcript } });
    };

    recognition.onerror = () => {
      alert("Could not capture your voice. Please try again.");
    };
  };

  // ✅ Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      // Redirect to chat with image query
      navigate("/chat", { state: { type: "image", content: "", imageUrl } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl shadow-lg">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/70 to-emerald-600/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 text-center text-white">
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce-slow">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold animate-scale-in">
              AgriGuide AI
            </h1>
            <p className="text-white/90 text-lg">Digital Agriculture Assistant</p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
          AI-powered agricultural advisory system that provides instant expert
          advice. Get help with crop diseases, weather guidance, pest control,
          soil management, and farming best practices.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in-up">
          {/* Text Queries */}
          <Card
            onClick={() => navigate("/chat")}
            className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <h3 className="font-semibold mb-2">Text Queries</h3>
            <p className="text-sm text-white/80">Ask questions about farming</p>
          </Card>

          {/* Voice Input */}
          <Card
            onClick={handleVoiceInput}
            className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20"
          >
            <Mic className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <h3 className="font-semibold mb-2">Voice Input</h3>
            <p className="text-sm text-white/80">Speak your farming questions naturally</p>
          </Card>

          {/* Image Analysis */}
          <label>
            <Card className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20">
              <Camera className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <h3 className="font-semibold mb-2">Image Analysis</h3>
              <p className="text-sm text-white/80">
                Upload crop photos for AI disease detection
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Card>
          </label>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/chat")}
          variant="agricultural"
          size="lg"
          className="text-lg px-8 py-6 animate-scale-in hover:scale-105 transition-all duration-300"
        >
          Start Your Agricultural Query
        </Button>
      </div>
    </div>
  );
};
