import { useState } from "react";
import { addAlert, closeAlert } from "../dawn-ui/components/AlertManager";
import Button from "../dawn-ui/components/Button";
import Column from "../dawn-ui/components/Column";
import Row from "../dawn-ui/components/Row";
import { TaskHookType } from "./hooks/useMainHook";
import { Group } from "./types";

function GroupEditor({ group, hook }: { group: Group; hook: TaskHookType }) {
  const [name, setName] = useState<string>(group.name);
  const [color, setColor] = useState<string | null>(group.theme || null);

  return (
    <Column>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input
                defaultValue={name}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                className="dawn-big"
              />
            </td>
          </tr>
          <tr>
            <td>Color</td>
            <td>
              <Row util={["no-gap"]}>
                <input
                  value={color ?? "#FFFFFF"}
                  onChange={(e) => setColor(e.currentTarget.value)}
                  className="dawn-big"
                  type="color"
                />
                <Button
                  big
                  style={{ margin: "0px" }}
                  onClick={() => setColor(null)}
                >
                  Remove Color
                </Button>
              </Row>
            </td>
          </tr>
        </tbody>
      </table>
      <Row>
        <Button big onClick={() => closeAlert()}>
          Close
        </Button>
        <Button
          big
          onClick={() => {
            hook.updateGroup(group.id, {
              name,
              theme: color,
            });
            closeAlert();
          }}
        >
          Save
        </Button>
      </Row>
    </Column>
  );
}

export function showGroupEditor(group: Group, hook: TaskHookType) {
  addAlert({
    title: `Edit Group ${group.name}`,
    body: <GroupEditor group={group} hook={hook} />,
  });
}
