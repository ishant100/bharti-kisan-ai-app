import { Card, CardContent } from "@/components/ui/card";
import { Leaf, CloudSun, Tractor } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/background-img.png";
import Reveal from "@/components/Reveal";

export default function About() {
  const { t } = useTranslation("common");

  const features = [
    { emoji: "💬", title: t("about.features.queries.title"), desc: t("about.features.queries.desc") },
    { emoji: "🌱", title: t("about.features.crop.title"), desc: t("about.features.crop.desc") },
    { emoji: "🐛", title: t("about.features.pest.title"), desc: t("about.features.pest.desc") },
    { emoji: "💧", title: t("about.features.fertilizer.title"), desc: t("about.features.fertilizer.desc") },
    { emoji: "⛅", title: t("about.features.weather.title"), desc: t("about.features.weather.desc") },
    { emoji: "📈", title: t("about.features.market.title"), desc: t("about.features.market.desc") },
    { emoji: "🪱", title: t("about.features.soil.title"), desc: t("about.features.soil.desc") },
    { emoji: "🏛️", title: t("about.features.schemes.title"), desc: t("about.features.schemes.desc") },
    { emoji: "🌍", title: t("about.features.language.title"), desc: t("about.features.language.desc") },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* content on top */}
      <div className="relative z-10 text-white">
        {/* hero text */}
        <Reveal>
          <div className="text-center py-16 px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{t("about.title")}</h1>
            <p className="text-white/90 max-w-2xl mx-auto">
              {t("about.subtitle")}
            </p>
          </div>
        </Reveal>

        {/* sections */}
        <div className="container mx-auto px-6 pb-16 space-y-12">
          {/* intro */}
          <Reveal>
            <section className="text-center">
              <p className="max-w-4xl leading-relaxed text-lg mx-auto">
                {t("about.intro")}
              </p>
            </section>
          </Reveal>

          {/* features */}
          <section className="space-y-6">
            <Reveal>
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                <Leaf className="w-6 h-6 text-emerald-300" /> {t("about.featuresTitle")}
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Reveal key={f.title} delayMs={i * 80}>
                  <Card className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{f.emoji}</div>
                      <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                      <p className="text-sm">{f.desc}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </section>

          {/* purpose */}
          <section className="space-y-4">
            <Reveal>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-emerald-300" /> {t("about.purposeTitle")}
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="max-w-4xl mx-auto text-lg leading-relaxed">
                {t("about.purpose")}
              </p>
            </Reveal>
          </section>

          {/* aim */}
          <section className="space-y-4">
            <Reveal>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Tractor className="w-6 h-6 text-emerald-300" /> {t("about.aimTitle")}
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="max-w-4xl mx-auto text-lg leading-relaxed">
                {t("about.aim")}
              </p>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}