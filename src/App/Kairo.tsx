import { useEffect, useState } from "react";
import { addAlert } from "../dawn-ui/components/AlertManager";
import Content from "../dawn-ui/components/Content";
import FAB from "../dawn-ui/components/FAB";
import Row from "../dawn-ui/components/Row";
import TaskList, { ListType } from "./tasks/TaskList";
import useMainHook from "./hooks/useMainHook";
import showTaskEditor from "./tasks/TaskEditor";
import showMoodLogger from "./MoodLogger";
import SettingsPage from "./SettingsPage";
import "react-calendar/dist/Calendar.css";
import { DawnTime } from "../dawn-ui/time";
import "./style.css";
import tips, { showTip } from "./tips";
import MoodHistoryForDate from "./MoodHistoryForDate";
import MoodHistory from "./MoodHistory";
import StreakPage from "./StreakPage";
import useSettings from "./hooks/useSettings";
import { ShortcutManager } from "../dawn-ui/components/ShortcutManager";
import KairoSidebar from "./Sidebar";

ShortcutManager.registerShortcut("search", { key: "s", modifiers: ["ctrl"] });
ShortcutManager.registerShortcut("new-task", {
  key: "n",
  modifiers: ["shift"],
});
ShortcutManager.registerShortcut("settings", {
  key: "s",
  modifiers: ["ctrl", "alt"],
});
ShortcutManager.registerShortcut("select-all", {
  key: "a",
  modifiers: ["ctrl"],
});
ShortcutManager.registerShortcut("deselect-all", {
  key: "a",
  modifiers: ["shift", "ctrl"],
});
ShortcutManager.registerShortcut("log-mood", {
  key: "l",
  modifiers: ["shift"],
  callback: showMoodLogger,
});

export default function Kairo() {
  const tasks = useMainHook();
  const [page, _setPage] = useState<string>("all");
  const settings = useSettings();

  useEffect(() => {
    if (window.location.hash) {
      setPage(window.location.hash.replace("#", ""));
    } else if (localStorage.getItem("kairo-default-page")) {
      setPage(localStorage.getItem("kairo-default-page") ?? "all");
    }

    window.addEventListener("hashchange", () => {
      let temp = window.location.hash.replace("#", "");
      if (temp !== page) setPage(temp);
    });

    ShortcutManager.setShortcutCallback("settings", () => {
      setPage("settings");
    });

    if ((localStorage.getItem("kairo-enable-tips") ?? "true") === "true") {
      if (
        localStorage.getItem("kairo-last-tip") !==
        DawnTime.formatDateString(new Date(), "YYYY-MM-DD")
      ) {
        localStorage.setItem(
          "kairo-last-tip",
          DawnTime.formatDateString(new Date(), "YYYY-MM-DD"),
        );
        showTip();
      }
    }
  }, []);

  function setPage(page: string) {
    _setPage(page);
    window.location.hash = page;
  }

  async function handleCreateTask() {
    let result = await showTaskEditor(page, tasks.groups);
    if (!result) return;
    tasks.createTask(result);
  }

  useEffect(() => {
    document.title = `Kairo: ${page}`;
  }, [page]);

  return (
    <Row
      className="full-page"
      util={["no-gap"]}
      style={{ position: "relative" }}
    >
      <FAB shortcut={"new-task"} clicked={handleCreateTask} />
      <KairoSidebar
        tasks={tasks}
        page={page}
        setPage={setPage}
        settings={settings}
      />
      <Content
        style={{
          width: "100%",
          overflow: "auto",
          margin: "0px",
          padding: "20px",
        }}
      >
        {page.startsWith("view_mood_details") ? (
          <MoodHistoryForDate date={page.split("@")[1]} hook={tasks} />
        ) : (
          <>
            {{
              mood_history: <MoodHistory hook={tasks} setPage={setPage} />,
              settings: <SettingsPage hook={tasks} />,
              streaks: <StreakPage />,
            }[page] ?? <TaskList hook={tasks} type={page as ListType} />}
          </>
        )}
      </Content>
    </Row>
  );
}
