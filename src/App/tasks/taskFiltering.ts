import { DawnTime, units } from "../../dawn-ui/time";
import { Group, Task } from "../types";
import { ListType } from "./TaskList";

export const filters: { [key: string]: (task: Task) => boolean } = {
  all: (t) => !t.finished,
  due: (t) => t.due !== null && !t.finished,
  finished: (t) => t.finished,
  repeating: (t) => !t.finished && t.repeat !== null,
} as const;

export type FilterType = keyof typeof filters;

export function filterTasks(tasks: Task[], query: string): Task[] {
  const regex = new RegExp(query, "gi");
  return tasks.filter(
    (x) =>
      x.id.toString().match(regex) ||
      x.title.match(regex) ||
      x.note?.match(regex) ||
      x.due?.match(regex) ||
      x.created_at.match(regex)
  );
}

export function groupTasks(
  tasks: Task[],
  groups: Group[],
  type: ListType | undefined
) {
  let data: { [key: string]: Task[] } = {};

  switch (type) {
    case "due":
      data = {
        Overdue: [],
        Today: [],
        Tomorrow: [],
        "In a week": [],
        Later: [],
      };

      for (const task of tasks) {
        const diff = new Date(task.due as string).getTime() - Date.now();
        if (diff < 0) data["Overdue"].push(task);
        else if (diff < units.day) data["Today"].push(task);
        else if (diff < units.day * 2) data["Tomorrow"].push(task);
        else if (diff < units.day * 7) data["In a week"].push(task);
        else data["Later"].push(task);
      }
      break;
    case "all":
    case "finished":
      for (const task of tasks)
        if (!task.in_group) {
          if (!data["Ungrouped"]) data["Ungrouped"] = [];
          data["Ungrouped"].push(task);
        } else {
          const name = groups.find((x) => x.id === task.in_group)
            ?.name as string;
          if (!data[name]) data[name] = [];
          data[name].push(task);
        }
      break;
    case "tagged":
      for (const task of tasks) {
        for (const tag of task.tags?.split(";") || []) {
          if (!data[tag]) data[tag] = [];
          data[tag].push(task);
        }
      }
      break;
    case "repeating":
      tasks = tasks.sort((a, b) => (a.repeat as number) - (b.repeat as number));
      data = {
        Other: [],
      };
      for (const task of tasks) {
        const time = new DawnTime(task.repeat as number);
        const unit = time.biggestUnit;
        if (!unit) {
          data["Other"].push(task);
          continue;
        }

        let key = `Every ${time.units[unit]} ${unit}${
          time.units[unit] !== 1 ? "s" : ""
        }`;
        if (time.units[unit] === 1)
          key = `Every ${unit}${time.units[unit] !== 1 ? "s" : ""}`;

        if (!data[key]) data[key] = [];
        data[key].push(task);
      }
      break;
    default:
      if (type?.startsWith("group")) {
        data = {
          "": tasks.filter(
            (x) => !x.finished && x.in_group?.toString() === type.split("-")[1]
          ),
          Finished: tasks.filter(
            (x) => x.finished && x.in_group?.toString() === type.split("-")[1]
          ),
        };
      }
      break;
  }

  return data;
}
