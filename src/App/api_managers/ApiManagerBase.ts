import { AxiosResponse } from "axios";
import { AxiosWrapper } from "../../dawn-ui/util";
import { Group, MoodLog, Task, User } from "../types";

export default abstract class ApiManagerBase {
  public abstract name: string;
  public abstract description: string;

  protected axiosClient: AxiosWrapper;

  constructor(axiosClient: AxiosWrapper) {
    this.axiosClient = axiosClient;
  }

  //#region User Calls
  abstract fetchUser(): Promise<AxiosResponse<User>>;
  abstract updateUserSettings(value: string): Promise<AxiosResponse<User>>;
  //#endregion

  //#region Task Calls
  abstract fetchTasks(): Promise<AxiosResponse<Task[]>>;
  abstract addTask(data: Partial<Task>): Promise<AxiosResponse<Task>>;
  abstract updateTask(
    id: number,
    data: Partial<Task>
  ): Promise<AxiosResponse<Task>>;
  abstract deleteTask(id: number): Promise<void>;
  //#endregion

  //#region Groups
  abstract fetchGroups(): Promise<AxiosResponse<Group[]>>;
  abstract addGroup(name: string): Promise<AxiosResponse<Group>>;
  abstract updateGroup(
    id: number,
    data: Partial<Group>
  ): Promise<AxiosResponse<Group>>;
  //#endregion

  //#region Moods
  abstract addMoodEntry(
    data: Partial<MoodLog>
  ): Promise<AxiosResponse<MoodLog>>;
  abstract fetchMoodEntries(): Promise<AxiosResponse<MoodLog[]>>;
  //#endregion
}
