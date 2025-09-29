import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ur", label: "اردو" }
];

export default function SettingsPopover() {
  const { i18n, t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const activeLang = useMemo(
    () => i18n.language?.split("-")[0] || "en",
    [i18n.language]
  );

  // Your existing 3-tuple hook works fine; ignoring the 3rd value is OK.
  const [fontPx, setFontPx] = useLocalStorage<number>("app.fontPx", 16);

  // Apply font size globally
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-size", `${fontPx}px`);
  }, [fontPx]);

  // Position panel under the button
  useEffect(() => {
    if (!open) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + window.scrollY + 8,
      left: r.right + window.scrollX - 320 // panel width
    });
  }, [open]);

  // Close on outside-click + ESC
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const tNode = e.target as Node;
      if (btnRef.current?.contains(tNode)) return;
      const panel = document.getElementById("settings-sheet");
      if (panel?.contains(tNode)) return;
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <>
      <Button
        ref={btnRef}
        variant="ghost"
        size="icon"
        aria-label={t("a11y.settings")}
        className="text-black hover:text-gray-700"
        onClick={() => setOpen(v => !v)}
      >
        <Settings className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {open &&
          createPortal(
            <motion.div
              id="settings-sheet"
              role="dialog"
              aria-label={t("settings.title")}
              className="fixed z-[9999] w-80 rounded-xl border bg-white/95 backdrop-blur shadow-2xl p-3"
              style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                {t("settings.title")}
              </div>

              {/* Language */}
              <div className="mt-2 rounded-lg border">
                <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40">
                  <Globe className="w-4 h-4" />
                  <div className="text-sm font-medium">{t("settings.language")}</div>
                </div>
                <ul className="max-h-56 overflow-auto p-1">
                  {LANGS.map(l => (
                    <li key={l.code}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-muted ${
                          activeLang === l.code ? "bg-muted" : ""
                        }`}
                        onClick={async () => {
                          await i18n.changeLanguage(l.code);
                          setOpen(false);
                        }}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Font size */}
              <div className="mt-3 rounded-lg border">
                <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/40">
                  <Type className="w-4 h-4" />
                  <div className="text-sm font-medium">{t("settings.fontSize")}</div>
                </div>
                <div className="px-3 py-3">
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={fontPx}
                    onChange={(e) => setFontPx(parseInt(e.target.value))}
                    className="w-full"
                    aria-label={t("settings.fontSize")}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("settings.currentSize", { size: fontPx })}
                  </div>
                </div>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
}
