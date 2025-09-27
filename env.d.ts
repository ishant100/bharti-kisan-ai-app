declare namespace NodeJS {
  interface ProcessEnv {
    GROQ_API_KEY?: string;
    GROQ_MODEL?: string;
    GROQ_VISION_MODEL?: string;
    VITE_API_BASE?: string;
    VITE_DATA_GOV_API_KEY?: string;
  }
}
