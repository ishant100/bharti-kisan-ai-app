import { MessageSquare, Camera, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-agriculture.jpg";
import logo from "@/assets/new-logo.png";

export const WelcomeHero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

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
        {/* Logo + Title (rounded green badge + white logo) */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
          <div
            className="h-16 w-16 md:h-18 md:w-18 rounded-2xl shadow-sm
                       bg-gradient-to-br from-emerald-500/80 to-green-700/80
                       backdrop-blur-[2px] flex items-center justify-center"
          >
            <img
              src={logo}
              alt="BHARTI-kisan ai"
              className="h-9 w-auto md:h-10 object-contain block"
            />
          </div>

          <div className="text-left leading-tight">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-white/90 text-lg">{t("hero.subtitle")}</p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
          {t("hero.description")}
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in-up">
          {/* Text Queries */}
          <Card
            onClick={() => navigate("/chat")}
            className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <h3 className="font-semibold mb-2">{t("features.textQueries.title")}</h3>
            <p className="text-sm text-white/80">{t("features.textQueries.caption")}</p>
          </Card>

          {/* Voice Input */}
          <Card
            onClick={handleVoiceInput}
            className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20"
          >
            <Mic className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <h3 className="font-semibold mb-2">{t("features.voiceInput.title")}</h3>
            <p className="text-sm text-white/80">{t("features.voiceInput.caption")}</p>
          </Card>

          {/* Image Analysis */}
          <label>
            <Card className="cursor-pointer p-4 bg-white/10 backdrop-blur-md border-white/20 text-white hover:scale-105 transition-all duration-300 hover:bg-white/20">
              <Camera className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <h3 className="font-semibold mb-2">{t("features.imageAnalysis.title")}</h3>
              <p className="text-sm text-white/80">
                {t("features.imageAnalysis.caption")}
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
          {t("hero.startQuery")}
        </Button>
      </div>
    </div>
  );
};
