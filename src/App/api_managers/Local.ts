import { AxiosResponse } from "axios";
import { User, Task, Group, MoodLog } from "../types";
import ApiManagerBase from "./ApiManagerBase";
import { AxiosWrapper } from "../../dawn-ui/util";

export type Key = "tasks" | "groups" | "moods" | "settings";
export interface KeyMap {
  tasks: Task[];
  groups: Group[];
  moods: MoodLog[];
  settings: string;
}

export interface Storage {
  get: <T extends Key>(key: T) => Promise<KeyMap[T]>;
  set: <T extends Key>(key: T, value: KeyMap[T]) => Promise<void>;
}

const defaultTaskData: Task = {
  id: 0,
  user: 0,
  title: "Title",
  note: null,
  in_group: null,
  finished: false,
  repeat: null,
  due: null,
  created_at: new Date().toISOString(),
  tags: null,
};

export default class LocalApiManager extends ApiManagerBase {
  public name: string = "local";
  public description: string = "Stores all your data on your device.";
  public storage: Storage;
  private userId: number = 0;

  constructor(storage: Storage) {
    super(new AxiosWrapper());
    this.storage = storage;
  }

  private generateTask(partial: Partial<Task> = {}): Task {
    return {
      ...defaultTaskData,
      ...parseInt,
      user: this.userId,
    };
  }

  public async fetchUser(): Promise<User> {
    return {
      id: this.userId,
      settings: await this.storage.get("settings"),
    };
  }

  public async updateUserSettings(value: string): Promise<User> {
    await this.storage.set("settings", value);
    return await this.fetchUser();
  }

  public async generateToken(): Promise<string> {
    throw new Error("Not Implemented");
  }

  public async fetchTasks(): Promise<Task[]> {
    return await this.storage.get("tasks");
  }

  public async addTask(data: Partial<Task>): Promise<Task> {
    const tasks = await this.fetchTasks();
    const task = this.generateTask(data);

    tasks.push(task);
    await this.storage.set("tasks", tasks);

    return task;
  }

  public async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const tasks = await this.fetchTasks();
    const index = tasks.findIndex((x) => x.id === id);
    if (!index) throw new Error(`Task ${id} does not exist`);
    tasks[index] = this.generateTask(data);
    await this.storage.set("tasks", tasks);
    return tasks[index];
  }

  public async deleteTask(id: number): Promise<void> {
    const tasks = await this.fetchTasks();
    const index = tasks.findIndex((x) => x.id === id);
    if (!index) throw new Error(`Task ${id} does not exist`);
    tasks.splice(index, 1);
    await this.storage.set("tasks", tasks);
  }

  public fetchGroups(): Promise<Group[]> {
    throw new Error("Method not implemented.");
  }

  public addGroup(name: string): Promise<Group> {
    throw new Error("Method not implemented.");
  }

  public updateGroup(id: number, data: Partial<Group>): Promise<Group> {
    throw new Error("Method not implemented.");
  }

  public addMoodEntry(data: Partial<MoodLog>): Promise<MoodLog> {
    throw new Error("Method not implemented.");
  }

  public fetchMoodEntries(): Promise<MoodLog[]> {
    throw new Error("Method not implemented.");
  }
}
