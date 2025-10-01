import { useTranslation } from "react-i18next";
import { SettingsPopover } from "./SettingsPopover";

export default function NavBar() {
  const { t } = useTranslation("common");

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">BHARTI-kisan ai</span>
          <span className="text-sm text-muted-foreground">{t("subtitle")}</span>
        </div>

        <nav className="hidden md:flex gap-8">
          <a href="/">{t("nav.home")}</a>
          <a href="/chat">{t("chat.title")}</a>
          <a href="/weather">{t("weather.title")}</a>
          <a href="/contacts">{t("contacts.title")}</a>
          <a href="/about">{t("nav.about")}</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Your bell icon component could sit here */}
          <SettingsPopover />
        </div>
      </div>
    </header>
  );
}
