import { useState } from "react";
import Column from "../../dawn-ui/components/Column";
import Container from "../../dawn-ui/components/Container";
import Row from "../../dawn-ui/components/Row";
import { spawnConfetti } from "../../dawn-ui/confetti";
import { DawnTime } from "../../dawn-ui/time";
import { combineClasses } from "../../dawn-ui/util";
import { TaskHookType } from "../hooks/useMainHook";
import { Task } from "../types";
import showTaskContextMenu from "./taskContext";
import { ListType } from "./TaskList";
import GoogleMatieralIcon from "../../dawn-ui/components/GoogleMaterialIcon";
import { getSearchResults } from "../../dawn-ui/seacher";
import { getTagsFromTagString } from "../util";
import Flyout from "../../dawn-ui/components/Flyout";
import ProgressBar from "../../dawn-ui/components/ProgressBar";

const collapseCache: { [key: string]: boolean } = {};

export default function TaskGroup({
  group,
  data,
  selected,
  setSelected,
  query,
  type,
  hook,
}: {
  group: string;
  data: { [key: string]: Task[] };
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  query: string;
  type: ListType | undefined;
  hook: TaskHookType;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(
    collapseCache[group] || false,
  );

  function _setCollapsed(state: boolean) {
    collapseCache[group] = state;
    setCollapsed(state);
  }

  const filtered = getSearchResults({
    query: query,
    data: data[group],
    keyCheck: ["note", "title"],
    custom: [[/@([a-z]+)/, (d, v) => d.tags?.split(";").includes(v) ?? false]],
  });

  const amount = filtered.length;
  const finished = filtered.filter((x) => x.finished).length;
  const percent = (amount / finished) * 100;

  return (
    <>
      <Row
        util={["align-center", "no-gap", "no-select"]}
        style={{ justifyContent: "space-between" }}
        onClick={() => _setCollapsed(!collapsed)}
      >
        <Row util={["no-gap"]}>
          <label>
            {group}
            {group.length !== 0 ? " - " : ""}
            {filtered.length} items{" "}
          </label>
          <GoogleMatieralIcon
            name={collapsed ? "arrow_right" : "arrow_drop_down"}
          />
        </Row>
      </Row>
      <Column style={{ margin: "3px", display: collapsed ? "none" : "flex" }}>
        {filtered.map((x) => (
          <Container
            className={combineClasses(
              x.due && !x.finished && Date.now() - new Date(x.due).getTime() > 0
                ? "dawn-danger"
                : "",
              selected.includes(x.id) ? "dawn-selected" : "",
            )}
            onClick={(e) => {
              if (e.ctrlKey) {
                if (selected.includes(x.id))
                  setSelected((old) => {
                    old.splice(old.indexOf(x.id), 1);
                    return [...old];
                  });
                else setSelected((old) => [...old, x.id]);
              }
            }}
            onContextMenu={(e) =>
              showTaskContextMenu({
                event: e,
                type,
                hook,
                task: x,
                setSelected,
              })
            }
            key={x.id}
            util={["no-min"]}
            style={{ width: "100%" }}
          >
            <Row>
              <input
                onClick={(e) => {
                  if (!x.finished) {
                    if (
                      (localStorage.getItem("kairo-show-confetti") ??
                        "true") === "true"
                    )
                      spawnConfetti(e.pageX, e.pageY);
                  }
                  hook.updateTask(x.id, { finished: !x.finished });
                }}
                readOnly
                checked={x.finished}
                type="checkbox"
              />
              <Column util={["small-gap"]}>
                <label>{x.title}</label>
                {x.note ? (
                  <label style={{ fontSize: "0.8em" }}>{x.note}</label>
                ) : (
                  ""
                )}
                {(x.due || x.repeat) && (
                  <small>
                    <Row>
                      {(
                        [
                          x.due
                            ? ["schedule", `${x.due}`, `Due on ${x.due}`]
                            : null,
                          x.repeat
                            ? [
                                "repeat",
                                new DawnTime(x.repeat || 0).toString(),
                                `Repeats every ${new DawnTime(
                                  x.repeat || 0,
                                ).toString()}`,
                              ]
                            : null,
                          x.tags
                            ? [
                                "sell",
                                getTagsFromTagString(x.tags).join(", "),
                                `Tags: ${getTagsFromTagString(x.tags).join(
                                  ", ",
                                )}`,
                              ]
                            : null,
                        ].filter((x) => x !== null) as [
                          string,
                          string,
                          string,
                        ][]
                      ).map((x) => (
                        <Flyout text={x[2] || ""} timeout={250}>
                          <Row
                            util={["small-gap", "align-center", "fit-content"]}
                          >
                            <GoogleMatieralIcon name={x[0]} />
                            <label>{x[1]}</label>
                          </Row>
                        </Flyout>
                      ))}
                    </Row>
                  </small>
                )}
              </Column>
            </Row>
          </Container>
        ))}
      </Column>
    </>
  );
}
