import { AxiosResponse } from "axios";
import { Group, MoodLog, Task, User } from "../types";
import ApiManagerBase from "./ApiManagerBase";

export default class ServerApiManager extends ApiManagerBase {
  //#region User Calls
  async fetchUser(): Promise<AxiosResponse<User>> {
    return await this.axiosClient.get<User>(`/api/user_data`);
  }

  async updateUserSettings(value: string): Promise<AxiosResponse<User>> {
    return await this.axiosClient.patch<User>(`/api/update_settings`, {
      settings: value,
    });
  }
  //#endregion

  //#region Task Calls
  async fetchTasks(): Promise<AxiosResponse<Task[]>> {
    return await this.axiosClient.get<Task[]>("/api/tasks");
  }

  async addTask(data: Partial<Task>): Promise<AxiosResponse<Task>> {
    return await this.axiosClient.post<Task>("/api/tasks", data);
  }

  async updateTask(
    id: number,
    data: Partial<Task>
  ): Promise<AxiosResponse<Task>> {
    return await this.axiosClient.patch<Task>(`/api/tasks/${id}`, data);
  }

  async deleteTask(id: number): Promise<void> {
    await this.axiosClient.delete(`/api/tasks/${id}`);
  }
  //#endregion

  //#region
  async fetchGroups(): Promise<AxiosResponse<Group[]>> {
    return await this.axiosClient.get<Group[]>("/api/groups");
  }

  async addGroup(name: string): Promise<AxiosResponse<Group>> {
    return await this.axiosClient.post<Group>("/api/groups", { name });
  }

  async updateGroup(
    id: number,
    data: Partial<Group>
  ): Promise<AxiosResponse<Group>> {
    return await this.axiosClient.patch<Group>(`/api/groups/${id}`, data);
  }
  //#endregion

  //#region Moods
  async addMoodEntry(data: Partial<MoodLog>): Promise<AxiosResponse<MoodLog>> {
    return await this.axiosClient.post<MoodLog>("/api/moods", data);
  }

  async fetchMoodEntries(): Promise<AxiosResponse<MoodLog[]>> {
    return await this.axiosClient.get<MoodLog[]>("/api/moods");
  }
  //#endregion
}
