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
