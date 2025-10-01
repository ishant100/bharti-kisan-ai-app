// src/components/Footer.tsx
import { Phone, Mail, MapPin, Leaf } from "lucide-react";

export const Footer = () => (
  <footer className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 py-10 mt-12 border-t border-emerald-300">
    <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-emerald-300/50 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-emerald-900" />
          </div>
          <div>
            <h2 className="font-bold text-xl">BHARTI-kisan ai</h2>
            <p className="text-sm text-emerald-800">Digital Agriculture Assistant</p>
          </div>
        </div>
        <p className="text-sm text-emerald-900/90 leading-relaxed">
          AI-powered advisory for crops, soil, irrigation, markets, and schemes — available 24/7.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Contact</h3>
        <p className="flex items-center gap-2 text-sm mb-2">
          <Phone className="w-4 h-4" /> +91 98765 43210
        </p>
        <p className="flex items-center gap-2 text-sm mb-2">
          <Mail className="w-4 h-4" /> support@BHARTI-kisan ai.com
        </p>
        <p className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" /> BHARTI-kisan ai HQ, India
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><a className="hover:underline" href="/weather">Weather Forecast & Alerts</a></li>
          <li><a className="hover:underline" href="/markets">Market Prices & Trends</a></li>
          <li><a className="hover:underline" href="/schemes">Government Schemes & Subsidies</a></li>
          <li><a className="hover:underline" href="/soil">Soil Health Monitoring</a></li>
        </ul>
      </div>
    </div>
    <div className="mt-8 border-t border-emerald-400 pt-4 text-center text-xs text-emerald-800">
      © {new Date().getFullYear()}BHARTI-kisan ai. All rights reserved.
    </div>
    <div className="text-center">by Ishant</div>
  </footer>
);
