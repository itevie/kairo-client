import { createContext, ReactNode, useContext, useState } from "react";
import { showErrorAlert } from "../../dawn-ui/components/AlertManager";

interface KairoSettings {
  useTransparency: boolean;
  defaultPage: string;
  enableTips: boolean;
  lastTip: number;
  promptMood: boolean;
  showConfetti: boolean;
  showMood: boolean;
  useMoodColors: boolean;
  userMoods: string[];
}

const typeMap: Record<
  keyof KairoSettings,
  "boolean" | "string" | "number" | "string[]"
> = {
  useTransparency: "boolean",
  defaultPage: "string",
  enableTips: "boolean",
  lastTip: "number",
  promptMood: "boolean",
  showConfetti: "boolean",
  showMood: "boolean",
  useMoodColors: "boolean",
  userMoods: "string[]",
};

const defaults: KairoSettings = {
  useTransparency: false,
  defaultPage: "due",
  enableTips: true,
  lastTip: 0,
  promptMood: true,
  showConfetti: true,
  showMood: true,
  useMoodColors: true,
  userMoods: ["sad", "dissatisfied", "neutral", "satisfied", "very_satisfied"],
};

const SharedDataContext = createContext<{
  settings: KairoSettings;
  setSetting: <T extends keyof KairoSettings>(
    key: T,
    value: KairoSettings[T]
  ) => void;
}>({ settings: loadSettings(), setSetting: () => {} });

export function SettingsDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<KairoSettings>(loadSettings());

  function setSetting<T extends keyof KairoSettings>(
    key: T,
    value: KairoSettings[T]
  ) {
    localStorage.setItem(
      `kairo-${key}`,
      Array.isArray(value) || typeof value === "object"
        ? JSON.stringify(value)
        : value.toString()
    );
    setSettings((old) => {
      return { ...old, [key]: value };
    });
  }

  return (
    <SharedDataContext.Provider value={{ settings, setSetting }}>
      {children}
    </SharedDataContext.Provider>
  );
}

export default function useSettings() {
  return useContext(SharedDataContext);
}

function loadSettings(): KairoSettings {
  const loaded: Partial<KairoSettings> = {};

  for (const setting in typeMap) {
    let key = setting as keyof typeof typeMap;
    let value = localStorage.getItem(`kairo-${key}`);
    if (value) {
      if (typeMap[key] === "boolean")
        (loaded[key] as boolean) = value === "true";
      else if (typeMap[key] === "number")
        (loaded[key] as number) = parseInt(value);
      else if (typeMap[key] === "string") (loaded[key] as string) = value;
      else if (typeMap[key] === "string[]")
        (loaded[key] as string[]) = JSON.parse(value);
      else
        showErrorAlert(
          `Failed to load setting: ${typeMap[key]}, setting: ${setting}`
        );
    }
  }

  return { ...defaults, ...loaded };
}
