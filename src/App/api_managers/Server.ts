import { AxiosResponse } from "axios";
import { Group, MoodLog, Task, User } from "../types";
import ApiManagerBase, { AllData } from "./ApiManagerBase";

export default class ServerApiManager extends ApiManagerBase {
  public name: string = "Server";
  public description: string = "Stores your tasks on kairo.dawn.rest";

  //#region User Calls
  async fetchUser(): Promise<User> {
    return (await this.axiosClient.get<User>(`/api/user_data`)).data;
  }

  async updateUserSettings(value: string): Promise<User> {
    return (
      await this.axiosClient.patch<User>(`/api/update_settings`, {
        settings: value,
      })
    ).data;
  }

  async fetchAllData(): Promise<AllData> {
    return (await this.axiosClient.get<AllData>(`/api/all`)).data;
  }

  async generateToken(): Promise<string> {
    return (await this.axiosClient.get<{ token: string }>("/auth/token")).data
      .token;
  }
  //#endregion

  //#region Task Calls
  async fetchTasks(): Promise<Task[]> {
    return (await this.axiosClient.get<Task[]>("/api/tasks")).data;
  }

  async addTask(data: Partial<Task>): Promise<Task> {
    return (await this.axiosClient.post<Task>("/api/tasks", data)).data;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return (await this.axiosClient.patch<Task>(`/api/tasks/${id}`, data)).data;
  }

  async deleteTask(id: number): Promise<void> {
    await this.axiosClient.delete(`/api/tasks/${id}`);
  }
  //#endregion

  //#region
  async fetchGroups(): Promise<Group[]> {
    return (await this.axiosClient.get<Group[]>("/api/groups")).data;
  }

  async addGroup(name: string): Promise<Group> {
    return (await this.axiosClient.post<Group>("/api/groups", { name })).data;
  }

  async updateGroup(id: number, data: Partial<Group>): Promise<Group> {
    return (await this.axiosClient.patch<Group>(`/api/groups/${id}`, data))
      .data;
  }
  //#endregion

  //#region Moods
  async addMoodEntry(data: Partial<MoodLog>): Promise<MoodLog> {
    return (await this.axiosClient.post<MoodLog>("/api/moods", data)).data;
  }

  async fetchMoodEntries(): Promise<MoodLog[]> {
    return (await this.axiosClient.get<MoodLog[]>("/api/moods")).data;
  }
  //#endregion
}
