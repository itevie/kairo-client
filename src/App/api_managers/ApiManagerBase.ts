import { AxiosResponse } from "axios";
import { AxiosWrapper } from "../../dawn-ui/util";
import { Group, MoodLog, Task, User } from "../types";

export interface AllData {
  tasks: Task[];
  groups: Group[];
  moods: MoodLog[];
}

export default abstract class ApiManagerBase {
  public abstract name: string;
  public abstract description: string;

  protected axiosClient: AxiosWrapper;

  constructor(axiosClient: AxiosWrapper) {
    this.axiosClient = axiosClient;
  }

  //#region User Calls
  abstract fetchUser(): Promise<User>;
  abstract updateUserSettings(value: string): Promise<User>;
  abstract generateToken(): Promise<string>;
  abstract fetchAllData(): Promise<AllData>;
  //#endregion

  //#region Task Calls
  abstract fetchTasks(): Promise<Task[]>;
  abstract addTask(data: Partial<Task>): Promise<Task>;
  abstract updateTask(id: number, data: Partial<Task>): Promise<Task>;
  abstract deleteTask(id: number): Promise<void>;
  //#endregion

  //#region Groups
  abstract fetchGroups(): Promise<Group[]>;
  abstract addGroup(name: string): Promise<Group>;
  abstract updateGroup(id: number, data: Partial<Group>): Promise<Group>;
  //#endregion

  //#region Moods
  abstract addMoodEntry(data: Partial<MoodLog>): Promise<MoodLog>;
  abstract fetchMoodEntries(): Promise<MoodLog[]>;
  //#endregion
}
