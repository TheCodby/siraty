export type Language = "en" | "ar";
export type Theme = "light" | "dark";

export interface AppSettings {
  language: Language;
  theme: Theme;
  direction: "ltr" | "rtl";
}
