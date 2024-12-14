import { useEffect, useRef, useState } from "react";
import Column from "../../dawn-ui/components/Column";
import Container from "../../dawn-ui/components/Container";
import Row from "../../dawn-ui/components/Row";
import { DawnTime } from "../../dawn-ui/time";
import { Task } from "../types";
import { setShortcutCallback } from "../../dawn-ui/components/ShortcutManager";
import { combineClasses } from "../../dawn-ui/util";
import { spawnConfetti } from "../../dawn-ui/confetti";
import { TaskSelectionControls } from "./TaskSelectionControls";
import { filterTasks, groupTasks } from "./taskFiltering";
import { TaskHookType } from "../hooks/useMainHook";
import showTaskContextMenu from "./taskContext";
import Button from "../../dawn-ui/components/Button";
import { showInfoAlert } from "../../dawn-ui/components/AlertManager";

export type ListType =
  | "due"
  | "all"
  | "finished"
  | "repeating"
  | `group-${number}`;

const filters: { [key: string]: (task: Task) => boolean } = {
  all: (t) => !t.finished,
  due: (t: Task) => t.due !== null && !t.finished,
  finished: (t: Task) => t.finished,
  repeating: (t: Task) => !t.finished && t.repeat !== null,
} as const;

export default function TaskList({
  hook,
  type,
}: {
  hook: TaskHookType;
  type?: ListType;
}) {
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
  }, [type]);

  let tasks = hook.tasks
    .filter(filters[type || "all"] || (() => true))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .sort(
      (a, b) => new Date(b.due || 0).getTime() - new Date(a.due || 0).getTime()
    );

  setShortcutCallback("search", () => {
    inputRef.current?.focus();
  });

  setShortcutCallback("select-all", () => {
    if (selected.length === tasks.length) setSelected([]);
    else setSelected(filterTasks(tasks, query).map((x) => x.id));
  });

  setShortcutCallback("deselect-all", () => {
    setSelected([]);
  });

  const data = groupTasks(tasks, hook.groups, type);

  return (
    <Column>
      <Row>
        <input
          style={{ flexGrow: "1", width: "100%" }}
          ref={inputRef}
          placeholder="Search tasks..."
          className="dawn-big dawn-page-input"
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
        <Row style={{ flexShrink: "1", width: "fit-content" }}>
          <Button
            className="dawn-button-round"
            onClick={() => {
              let randomTasks = Object.values(data)
                .flat(1)
                .filter((x) => !x.finished);
              if (randomTasks.length === 0)
                return showInfoAlert(
                  `Oops! Looks like you've completed all the tasks in this tab. Well-done!`
                );
              let randomTask =
                randomTasks[
                  Math.floor(Math.random() * randomTasks.length)
                ].id.toString();
              if (inputRef.current) inputRef.current.value = randomTask;
              setQuery(randomTask);
            }}
          >
            Random
          </Button>
        </Row>
      </Row>
      {selected.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <hr />
          <TaskSelectionControls
            selected={selected}
            setSelected={setSelected}
            hook={hook}
            tasks={tasks}
          />
          <hr />
        </div>
      )}
      {Object.keys(data)
        .filter((x) => filterTasks(data[x], query).length > 0)
        .map((k) => (
          <>
            <label>
              {k}
              {k.length !== 0 ? " - " : ""}
              {filterTasks(data[k], query).length} items{" "}
            </label>
            <Column style={{ margin: "3px" }}>
              {filterTasks(data[k], query).map((x) => (
                <Container
                  className={combineClasses(
                    x.due &&
                      !x.finished &&
                      Date.now() - new Date(x.due).getTime() > 0
                      ? "dawn-danger"
                      : "",
                    selected.includes(x.id) ? "dawn-selected" : ""
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
                    <Column>
                      <label>{x.title}</label>
                      {x.note ? (
                        <label style={{ fontSize: "0.8em" }}>{x.note}</label>
                      ) : (
                        ""
                      )}
                      {(x.due || x.repeat) && (
                        <small>
                          {x.due ? `Due: ${x.due} ` : ""}
                          {x.repeat
                            ? `Repeat: ${new DawnTime(
                                x.repeat || 0
                              ).toString()}`
                            : ""}
                        </small>
                      )}
                    </Column>
                  </Row>
                </Container>
              ))}
            </Column>
          </>
        ))}
    </Column>
  );
}
