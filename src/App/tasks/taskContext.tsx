import { showContextMenu } from "../../dawn-ui/components/ContextMenuManager";
import { TaskHookType } from "../hooks/useMainHook";
import { Task } from "../types";
import showTaskEditor from "./TaskEditor";
import { ListType } from "./TaskList";

export default function showTaskContextMenu({
  event,
  type,
  task,
  setSelected,
  hook,
}: {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  type: ListType | undefined;
  task: Task;
  setSelected: (value: React.SetStateAction<number[]>) => void;
  hook: TaskHookType;
}) {
  showContextMenu({
    event: event,
    elements: [
      {
        label: "Select",
        type: "button",
        onClick: () => {
          setSelected((old) => [...old, task.id]);
        },
      },
      {
        label: "Edit",
        type: "button",
        onClick: async () => {
          const result = await showTaskEditor(
            type ?? "",
            hook.groups,
            task,
            true
          );
          if (!result) return;
          await hook.updateTask(task.id, result);
        },
      },
      {
        label: "Move To...",
        type: "button",
        onClick: (ev, r) => {
          r({
            event: ev,
            elements: [
              {
                label: "No Group",
                type: "button",
                onClick: async () => {
                  await hook.updateTask(task.id, {
                    in_group: null,
                  });
                },
              },
              ...hook.groups.map((x) => {
                return {
                  label: x.name,
                  type: "button",
                  onClick: async () => {
                    await hook.updateTask(task.id, {
                      in_group: x.id,
                    });
                  },
                } as const;
              }),
            ],
          });
        },
      },
      {
        type: "seperator",
      },
      {
        label: "Delete",
        type: "button",
        scheme: "danger",
        onClick: () => hook.deleteTask(task.id),
      },
    ],
  });
}
