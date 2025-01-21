import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  addAlert,
  showErrorAlert,
} from "../../dawn-ui/components/AlertManager";
import { setTheme, themeSetBackground } from "../../dawn-ui";
import api from "../api";

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
  syncAppearance: boolean;
  syncMoodLogger: boolean;
  backgroundImage: string;
  theme: string;
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
  syncAppearance: "boolean",
  syncMoodLogger: "boolean",
  backgroundImage: "string",
  theme: "string",
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
  syncAppearance: false,
  syncMoodLogger: false,
  backgroundImage: "",
  theme: "dark",
};

const appearanceKeys: (keyof KairoSettings)[] = [
  "useTransparency",
  "defaultPage",
  "showConfetti",
  "syncAppearance",
  "backgroundImage",
  "theme",
];

const moodLoggerKeys: (keyof KairoSettings)[] = [
  "promptMood",
  "showMood",
  "useMoodColors",
  "userMoods",
  "syncMoodLogger",
];

const SharedDataContext = createContext<{
  settings: KairoSettings;
  setSetting: <T extends keyof KairoSettings>(
    key: T,
    value: KairoSettings[T]
  ) => void;
}>({ settings: loadSettings(), setSetting: () => {} });

export function SettingsDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<KairoSettings>(loadSettings());

  useEffect(() => {
    (async () => {
      if (window.location.pathname === "/login") return;
      try {
        const x = await api.fetchUser();
        setSettings((old) => {
          const result = JSON.parse(x.data.settings);
          const set: Partial<KairoSettings> = {};

          if (result.syncAppearance)
            for (const key of appearanceKeys)
              if (key in result) {
                if (result[key] !== settings[key]) {
                  localStorage.setItem(`kairo-${key}`, result[key]);
                  if (key === "backgroundImage")
                    themeSetBackground(result[key]);
                  if (key === "theme") setTheme(result[key]);
                }
                set[key] = result[key];
              }

          if (result.syncMoodLogger)
            for (const key of moodLoggerKeys)
              if (key in result) set[key] = result[key];

          return { ...old, ...set };
        });
      } catch (e) {
        console.log(e);
        addAlert({
          title: "Are you logged in?",
          body: "Kairo failed to load your user settings, you might need to log in.",
          buttons: [
            {
              id: "ignore",
              text: "Ignore",
              click(close) {
                close();
              },
            },
            {
              id: "login",
              text: "Login",
              click(close) {
                close();
                window.location.href = "/login";
              },
            },
          ],
        });
      }
    })();
  }, []);

  function constructSync(): Partial<KairoSettings> {
    const result: Partial<KairoSettings> = {};
    if (settings.syncAppearance)
      for (const key of appearanceKeys)
        if (key in settings) result[key] = settings[key] as any;
    if (settings.syncMoodLogger)
      for (const key of moodLoggerKeys)
        if (key in settings) result[key] = settings[key] as any;
    return result;
  }

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

    (async () => {
      const toSync = constructSync();
      toSync[key] = value;
      await api.updateUserSettings(JSON.stringify(toSync));
    })();
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
