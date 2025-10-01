import { useEffect, useState } from "react";
import { Leaf, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {SettingsPopover} from "@/components/SettingsPopover";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur shadow-sm border-border"
          : "bg-transparent border-transparent"
      ].join(" ")}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center shadow-sm">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-black">BHARTI-kisan ai</h1>
            <p className="text-sm text-gray-600">{t("subtitle")}</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-black hover:text-gray-700" href="/">{t("nav.home")}</a>
          <a className="text-black hover:text-gray-700" href="/chat">{t("chat.title")}</a>
          <a className="text-black hover:text-gray-700" href="/weather">{t("weather.title")}</a>
          <a className="text-black hover:text-gray-700" href="/contacts">{t("nav.contacts")}</a>
         <a className="text-black hover:text-gray-700" href="/about">{t("nav.about")}</a>
        </nav>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-black hover:text-gray-700" aria-label={t("a11y.notifications")}>
            <Bell className="w-5 h-5" />
          </Button>
          <SettingsPopover />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-black"
          onClick={() => setOpen(v => !v)}
          aria-label={t("a11y.menu")}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            <a onClick={() => setOpen(false)} href="/">{t("nav.home")}</a>
            <a onClick={() => setOpen(false)} href="/chat">{t("chat.title")}</a>
            <a onClick={() => setOpen(false)} href="/weather">{t("weather.title")}</a>
            <a onClick={() => setOpen(false)} href="/contacts">{t("nav.contacts")}</a>
            <a onClick={() => setOpen(false)} href="/about">{t("nav.about")}</a>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-1">{t("settings.title")}</div>
              <SettingsPopover />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
  