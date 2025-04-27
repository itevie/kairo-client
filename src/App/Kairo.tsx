import { useEffect, useState } from "react";
import { addAlert, showInputAlert } from "../dawn-ui/components/AlertManager";
import Column from "../dawn-ui/components/Column";
import Content from "../dawn-ui/components/Content";
import FAB from "../dawn-ui/components/FAB";
import Row from "../dawn-ui/components/Row";
import Sidebar from "../dawn-ui/components/Sidebar";
import SidebarButton from "../dawn-ui/components/SidebarButton";
import TaskList, { ListType } from "./tasks/TaskList";
import useMainHook from "./hooks/useMainHook";
import showTaskEditor from "./tasks/TaskEditor";
import {
  registerShortcut,
  setShortcutCallback,
} from "../dawn-ui/components/ShortcutManager";
import showMoodLogger from "./MoodLogger";
import SettingsPage from "./SettingsPage";
import "react-calendar/dist/Calendar.css";
import { DawnTime } from "../dawn-ui/time";
import "./style.css";
import { showContextMenu } from "../dawn-ui/components/ContextMenuManager";
import tips from "./tips";
import MoodHistoryForDate from "./MoodHistoryForDate";
import MoodHistory from "./MoodHistory";
import { showGroupEditor } from "./GroupEditor";
import StreakPage from "./StreakPage";
import useSettings from "./hooks/useSettings";

registerShortcut("search", { key: "s", modifiers: ["ctrl"] });
registerShortcut("new-task", { key: "n", modifiers: ["shift"] });
registerShortcut("settings", { key: "s", modifiers: ["ctrl", "alt"] });
registerShortcut("select-all", { key: "a", modifiers: ["ctrl"] });
registerShortcut("deselect-all", { key: "a", modifiers: ["shift", "ctrl"] });
registerShortcut("log-mood", {
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
      setPage(window.location.hash.replace("#", ""));
    });

    setShortcutCallback("settings", () => {
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
        addAlert({
          title: "Daily Tip",
          body: <label>{tips[Math.floor(Math.random() * tips.length)]}</label>,
          buttons: [
            {
              id: "disable",
              text: "Disable Tips",
              click(close) {
                localStorage.setItem("kairo-enable-tips", "false");
                close();
              },
            },
            {
              id: "ok",
              text: "OK!",
              click(close) {
                close();
              },
            },
          ],
        });
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

  return (
    <Row
      className="full-page"
      util={["no-gap"]}
      style={{ position: "relative" }}
    >
      <FAB shortcut={"new-task"} clicked={handleCreateTask} />
      <Sidebar>
        <Column util={["no-select"]} style={{ gap: "5px" }}>
          {settings.settings.showMood && (
            <>
              <SidebarButton
                label="Log Mood"
                icon="add"
                onClick={showMoodLogger}
              />
              <SidebarButton
                label="Mood History"
                icon="calendar_month"
                onClick={() => setPage("mood_history")}
              />
              <hr />
            </>
          )}
          <SidebarButton
            label="Streaks"
            icon="local_fire_department"
            onClick={() => setPage("streaks")}
          />
          <hr />
          {[
            ["Due", "due", "schedule"],
            ["All", "all", "list"],
            ["Tagged", "tagged", "sell"],
            ["Reapting", "repeating", "replay"],
            ["Finished", "finished", "task_alt"],
          ].map((x) => (
            <SidebarButton
              label={x[0]}
              icon={x[2]}
              selected={page === x[1]}
              onClick={() => setPage(x[1])}
            />
          ))}
          <hr />
          {tasks.groups.map((x) => (
            <SidebarButton
              key={x.id}
              label={x.name}
              icon="folder"
              selected={page === `group-${x.id}`}
              onClick={() => setPage(`group-${x.id}`)}
              style={x.theme ? { color: x.theme } : {}}
              onContextMenu={(e) => {
                showContextMenu({
                  event: e,
                  elements: [
                    {
                      type: "button",
                      label: "Edit",
                      onClick: () => {
                        showGroupEditor(x, tasks);
                      },
                    },
                  ],
                });
              }}
            />
          ))}
          {tasks.groups.length > 0 && <hr />}
          <SidebarButton
            label="New Group"
            icon="folder"
            onClick={async () => {
              const name = await showInputAlert("Enter group name");
              if (name) tasks.createGroup(name);
            }}
          />
          <SidebarButton
            label="Settings"
            icon="settings"
            onClick={() => setPage("settings")}
          />
        </Column>
      </Sidebar>
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
