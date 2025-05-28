import { showInputAlert } from "../dawn-ui/components/AlertManager";
import Column from "../dawn-ui/components/Column";
import { showContextMenu } from "../dawn-ui/components/ContextMenuManager";
import Sidebar from "../dawn-ui/components/Sidebar";
import SidebarButton from "../dawn-ui/components/SidebarButton";
import { showGroupEditor } from "./GroupEditor";
import { TaskHookType } from "./hooks/useMainHook";
import useSettings from "./hooks/useSettings";
import showMoodLogger from "./MoodLogger";

export default function KairoSidebar({
  page,
  setPage,
  settings,
  tasks,
}: {
  page: string;
  tasks: TaskHookType;
  setPage: (page: string) => void;
  settings: ReturnType<typeof useSettings>;
}) {
  return (
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
  );
}
