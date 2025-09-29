import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./resources/en/common.json";
import hi from "./resources/hi/common.json";
import bn from "./resources/bn/common.json";
import mr from "./resources/mr/common.json";
import te from "./resources/te/common.json";
import ta from "./resources/ta/common.json";
import gu from "./resources/gu/common.json";
import kn from "./resources/kn/common.json";
import ml from "./resources/ml/common.json";
import pa from "./resources/pa/common.json";
import orIN from "./resources/or/common.json";
import as from "./resources/as/common.json";
import ur from "./resources/ur/common.json";

const resources = {
  en: { common: en },
  hi: { common: hi },
  bn: { common: bn },
  mr: { common: mr },
  te: { common: te },
  ta: { common: ta },
  gu: { common: gu },
  kn: { common: kn },
  ml: { common: ml },
  pa: { common: pa },
  or: { common: orIN },
  as: { common: as },
  ur: { common: ur }
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "querystring"],
      caches: ["localStorage"]
    }
  });

const RTL = new Set(["ur"]);
const apply = (lng: string) => {
  const html = document.documentElement;
  html.lang = lng;
  html.dir = RTL.has(lng) ? "rtl" : "ltr";
};
i18n.on("languageChanged", apply);
apply(i18n.language || "en");

export default i18n;
