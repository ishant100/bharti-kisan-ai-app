// import { Card, CardContent } from "@/components/ui/card";
// import { Leaf, CloudSun, Tractor } from "lucide-react";
// import heroImage from "@/assets/hero-agriculture.jpg"; // full-page background

// export default function About() {
//   const features = [
//     { emoji: "💬", title: "Ask Queries", desc: "Ask via text, voice, or by uploading a photo." },
//     { emoji: "🌱", title: "Crop Guidance", desc: "Suggests the best crop for your land and season." },
//     { emoji: "🐛", title: "Pest & Disease Control", desc: "Detects issues and gives simple solutions." },
//     { emoji: "💧", title: "Fertilizer & Water Advice", desc: "Right amounts to avoid waste." },
//     { emoji: "⛅", title: "Weather Updates", desc: "Warns about rain, storms, and heat in advance." },
//     { emoji: "📈", title: "Market Prices", desc: "Find better rates to sell your crops." },
//     { emoji: "🪱", title: "Soil Health Tips", desc: "Practical ways to keep soil fertile." },
//     { emoji: "🏛️", title: "Government Schemes", desc: "Subsidies, loans, and support programs." },
//     { emoji: "🌍", title: "Local Language Support", desc: "Simple, farmer-friendly answers." },
//   ];

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center relative"
//       style={{ backgroundImage: `url(${heroImage})` }}
//     >
//       {/* Dark overlay for readability */}
//       <div className="absolute inset-0 bg-black/60" />

//       {/* Content on top */}
//       <div className="relative z-10 text-white">
//         {/* Hero text */}
//         <div className="text-center py-16 px-6 animate-fade-in">
//           <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
//             About AgriGuide AI
//           </h1>
//           <p className="text-white/90 max-w-2xl mx-auto">
//             AI-Based Farmer Query Support & Advisory System
//           </p>
//         </div>

//         {/* Sections */}
//         <div className="container mx-auto px-6 py-12 space-y-12">
//           {/* Intro */}
//           <section className="animate-fade-in-up text-center">
//             <p className="max-w-4xl leading-relaxed text-lg mx-auto">
//               Our project, <b>AI-Based Farmer Query Support and Advisory System</b>, is developed to
//               help farmers solve their day-to-day farming problems using Artificial Intelligence (AI).
//             </p>
//           </section>

//           {/* Features */}
//           <section className="space-y-6 animate-fade-in-up">
//             <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
//               <Leaf className="w-6 h-6 text-emerald-300" /> What’s in the App (Features)
//             </h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {features.map((f) => (
//                 <Card
//                   key={f.title}
//                   className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
//                 >
//                   <CardContent className="p-6">
//                     <div className="text-3xl mb-3">{f.emoji}</div>
//                     <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
//                     <p className="text-sm">{f.desc}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* Purpose */}
//           <section className="space-y-4 animate-fade-in-up">
//             <h2 className="text-3xl font-bold flex items-center gap-2">
//               <CloudSun className="w-6 h-6 text-emerald-300" /> Why this App (Purpose)
//             </h2>
//             <p className="max-w-4xl mx-auto text-lg leading-relaxed">
//               Farmers often face challenges like crop diseases, unpredictable weather, wrong
//               fertilizer use, and lack of market knowledge. Traditional support is slow and not
//               always available. <br /><br />
//               This app acts as a <b>24/7 smart assistant</b>, giving the right advice at the right
//               time. It helps increase crop yield, reduce losses, save money, and support modern,
//               sustainable farming practices.
//             </p>
//           </section>

//           {/* Aim */}
//           <section className="space-y-4 animate-fade-in-up">
//             <h2 className="text-3xl font-bold flex items-center gap-2">
//               <Tractor className="w-6 h-6 text-emerald-300" /> Project Aim
//             </h2>
//             <p className="max-w-4xl mx-auto text-lg leading-relaxed">
//               To use technology in a <b>simple and practical</b> way so that even small farmers in
//               villages can benefit. The ultimate goal is to make farming <b>smarter, easier, and more
//               profitable</b>, contributing to rural development and food security.
//             </p>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// 


import { Card, CardContent } from "@/components/ui/card";
import { Leaf, CloudSun, Tractor } from "lucide-react";
import heroImage from "@/assets/background-img.png";
import Reveal from "@/components/Reveal";

export default function About() {
  const features = [
    { emoji: "💬", title: "Ask Queries", desc: "Ask via text, voice, or by uploading a photo." },
    { emoji: "🌱", title: "Crop Guidance", desc: "Suggests the best crop for your land and season." },
    { emoji: "🐛", title: "Pest & Disease Control", desc: "Detects issues and gives simple solutions." },
    { emoji: "💧", title: "Fertilizer & Water Advice", desc: "Right amounts to avoid waste." },
    { emoji: "⛅", title: "Weather Updates", desc: "Warns about rain, storms, and heat in advance." },
    { emoji: "📈", title: "Market Prices", desc: "Find better rates to sell your crops." },
    { emoji: "🪱", title: "Soil Health Tips", desc: "Practical ways to keep soil fertile." },
    { emoji: "🏛️", title: "Government Schemes", desc: "Subsidies, loans, and support programs." },
    { emoji: "🌍", title: "Local Language Support", desc: "Simple, farmer-friendly answers." },
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">About AgriGuide AI</h1>
            <p className="text-white/90 max-w-2xl mx-auto">
              AI-Based Farmer Query Support & Advisory System
            </p>
          </div>
        </Reveal>

        {/* sections */}
        <div className="container mx-auto px-6 pb-16 space-y-12">
          {/* intro */}
          <Reveal>
            <section className="text-center">
              <p className="max-w-4xl leading-relaxed text-lg mx-auto">
                Our project, <b>AI-Based Farmer Query Support and Advisory System</b>, is developed to
                help farmers solve their day-to-day farming problems using Artificial Intelligence (AI).
              </p>
            </section>
          </Reveal>

          {/* features */}
          <section className="space-y-6">
            <Reveal>
              <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                <Leaf className="w-6 h-6 text-emerald-300" /> What’s in the App (Features)
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
                <CloudSun className="w-6 h-6 text-emerald-300" /> Why this App (Purpose)
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="max-w-4xl mx-auto text-lg leading-relaxed">
                Farmers often face challenges like crop diseases, unpredictable weather, wrong
                fertilizer use, and lack of market knowledge. Traditional support is slow and not
                always available. <br /><br />
                This app acts as a <b>24/7 smart assistant</b>, giving the right advice at the right
                time. It helps increase crop yield, reduce losses, save money, and support modern,
                sustainable farming practices.
              </p>
            </Reveal>
          </section>

          {/* aim */}
          <section className="space-y-4">
            <Reveal>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Tractor className="w-6 h-6 text-emerald-300" /> Project Aim
              </h2>
            </Reveal>
            <Reveal delayMs={100}>
              <p className="max-w-4xl mx-auto text-lg leading-relaxed">
                To use technology in a <b>simple and practical</b> way so that even small farmers in
                villages can benefit. The ultimate goal is to make farming <b>smarter, easier, and more
                profitable</b>, contributing to rural development and food security.
              </p>
            </Reveal>
          </section>
        </div>
      </div>
    </div>
  );
}
