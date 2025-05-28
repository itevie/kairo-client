import { useEffect, useRef, useState } from "react";
import Column from "../../dawn-ui/components/Column";
import Row from "../../dawn-ui/components/Row";
import { Task } from "../types";
import { TaskSelectionControls } from "./TaskSelectionControls";
import { filterTasks, groupTasks } from "./taskFiltering";
import { TaskHookType } from "../hooks/useMainHook";
import Button from "../../dawn-ui/components/Button";
import { showInfoAlert } from "../../dawn-ui/components/AlertManager";
import TaskGroup from "./TaskGroup";
import { getSearchResults } from "../../dawn-ui/seacher";
import { ShortcutManager } from "../../dawn-ui/components/ShortcutManager";

export type ListType =
  | "due"
  | "all"
  | "finished"
  | "repeating"
  | "tagged"
  | `group-${number}`;

const filters: { [key: string]: (task: Task) => boolean } = {
  all: (t) => !t.finished,
  due: (t: Task) => t.due !== null && !t.finished,
  finished: (t: Task) => t.finished,
  repeating: (t: Task) => !t.finished && t.repeat !== null,
  tagged: (t: Task) => !!t.tags && t.tags?.length > 0,
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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .sort(
      (a, b) => new Date(b.due || 0).getTime() - new Date(a.due || 0).getTime(),
    );

  ShortcutManager.setShortcutCallback("search", () => {
    inputRef.current?.focus();
  });

  ShortcutManager.setShortcutCallback("select-all", () => {
    if (selected.length === tasks.length) setSelected([]);
    else setSelected(filterTasks(tasks, query).map((x) => x.id));
  });

  ShortcutManager.setShortcutCallback("deselect-all", () => {
    setSelected([]);
  });

  const data = groupTasks(tasks, hook.groups, type);
  const vals = Object.values(data);
  const amount = vals.reduce((p, c) => p + c.length, 0);
  const finished = vals.reduce(
    (p, c) => p + c.filter((x) => x.finished).length,
    0,
  );
  const percent = (100 * finished) / amount;

  return (
    <Column>
      <Row>
        <input
          style={{ flexGrow: "1", width: "100%" }}
          ref={inputRef}
          placeholder="Search tasks..."
          className="dawn-big dawn-page-input dawn-shrink"
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
                  `Oops! Looks like you've completed all the tasks in this tab. Well-done!`,
                );

              let randomTask = `id=${randomTasks[
                Math.floor(Math.random() * randomTasks.length)
              ].id.toString()}`;

              if (inputRef.current) inputRef.current.value = randomTask;
              setQuery(randomTask);
            }}
          >
            Random
          </Button>
        </Row>
      </Row>

      {type?.startsWith("group-") && !Number.isNaN(percent) ? (
        <Row
          util={["fit-content"]}
          style={{ alignSelf: "flex-end", marginBottom: "-40px" }}
        >
          <label>{percent}%</label>
          <progress max={100} value={percent}></progress>
        </Row>
      ) : (
        <></>
      )}

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
        .filter(
          (x) =>
            getSearchResults({
              data: data[x],
              query,
              keyCheck: ["title", "note"],
              custom: [
                [
                  /@([a-z]+)/,
                  (d, v) => d.tags?.split(";").includes(v) ?? false,
                ],
              ],
            }).length > 0,
        )
        .map((k) => (
          <TaskGroup
            group={k}
            data={data}
            selected={selected}
            setSelected={setSelected}
            query={query}
            hook={hook}
            type={type}
          />
        ))}
    </Column>
  );
}
