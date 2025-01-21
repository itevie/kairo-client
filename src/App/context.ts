import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { Group, Task } from "./types";

export function isTauri() {
  // @ts-ignore
  return typeof window !== "undefined" && window.__TAURI__.isTauri;
}

type CacheKey = "tasks" | "groups";
interface CacheKeyValues {
  tasks: Task[];
  groups: Group[];
}

export function setCache<T extends CacheKey>(key: T, value: CacheKeyValues[T]) {
  console.log(`Set Cache: ${key}`);
  localStorage.setItem(`kairo_cache_${key}`, JSON.stringify(value));
}

export function getCache<T extends CacheKey>(key: T): CacheKeyValues[T] {
  console.log(`Get Cache: ${key}`);
  return JSON.parse(localStorage.getItem(`kairo_cache_${key}`) || "[]");
}

export async function checkNotifications(tasks: Task[]): Promise<void> {
  let due = tasks.filter(
    (x) => x.due && Date.now() - new Date(x.due).getTime() < 0
  );

  let permissionGranted = await isPermissionGranted();

  // If not we need to request it
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }

  console.log(due);

  sendNotification({
    title: "test",
    channelId: "test",
  });
}
