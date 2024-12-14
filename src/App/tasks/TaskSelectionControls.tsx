import Row from "../../dawn-ui/components/Row";
import Flyout from "../../dawn-ui/components/Flyout";
import { showConfirmModel } from "../../dawn-ui/components/AlertManager";
import Column from "../../dawn-ui/components/Column";
import GoogleMatieralIcon from "../../dawn-ui/components/GoogleMaterialIcon";
import { Task } from "../types";
import { TaskHookType } from "../hooks/useMainHook";

export function TaskSelectionControls({
  selected,
  tasks,
  setSelected,
  hook,
}: {
  selected: number[];
  tasks: Task[];
  hook: TaskHookType;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  if (selected.length === 0) return null;

  return (
    <Column style={{ gap: "5px" }}>
      <label>{selected.length} tasks selected</label>
      <Row style={{ justifyContent: "center" }}>
        <Flyout direction="up" text="Delete Selected">
          <GoogleMatieralIcon
            name="delete"
            onClick={() => {
              showConfirmModel(
                "Are you sure you want to delete all selected tasks?",
                () => {
                  for (const task of tasks.filter((x) =>
                    selected.includes(x.id)
                  ))
                    hook.deleteTask(task.id);
                  setSelected([]);
                }
              );
            }}
          />
        </Flyout>
        <Flyout text="Mark Selected as Finished">
          <GoogleMatieralIcon
            name="check_circle"
            onClick={() => {
              showConfirmModel(
                "Are you sure you want to finish all selected tasks?",
                () => {
                  for (const task of tasks.filter(
                    (x) => !x.finished && selected.includes(x.id)
                  ))
                    hook.updateTask(task.id, { finished: true });
                  setSelected([]);
                }
              );
            }}
          />
        </Flyout>
        <Flyout text="Mark Selected as Unfinished">
          <GoogleMatieralIcon
            name="unpublished"
            onClick={() => {
              showConfirmModel(
                "Are you sure you want to unfinish all selected tasks?",
                () => {
                  for (const task of tasks.filter(
                    (x) => x.finished && selected.includes(x.id)
                  ))
                    hook.updateTask(task.id, { finished: false });
                  setSelected([]);
                }
              );
            }}
          />
        </Flyout>
        <Flyout text="Deselect All">
          <GoogleMatieralIcon
            name="check_box_outline_blank"
            onClick={() => setSelected([])}
          />
        </Flyout>
      </Row>
    </Column>
  );
}
