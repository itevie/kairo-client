import { useEffect, useState } from "react";
import { Group, MoodLog, Task } from "../types";
import { DawnTime } from "../../dawn-ui/time";
import showMoodLogger from "../MoodLogger";
import { checkNotifications, getCache } from "../context";
import api from "../api";

export type TaskHookType = ReturnType<typeof useMainHook>;

export default function useMainHook() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [moods, setMoods] = useState<MoodLog[]>([]);

  useEffect(() => {
    checkNotifications(tasks);
  }, [tasks]);

  useEffect(() => {
    setTasks(getCache("tasks"));
    setGroups(getCache("groups"));

    _fetchMoodEntries();
    reloadGroups();
    reloadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Tasks -----

  async function reloadTasks() {
    try {
      const response = await api.fetchTasks();
      localStorage.setItem("kairo_task_cache", JSON.stringify(response.data));
      setTasks(response.data);
    } catch {}
  }

  async function createTask(data: Partial<Task>) {
    try {
      await api.addTask(data);
      reloadTasks();
    } catch {}
  }

  async function _updateTask(id: number, data: Partial<Task>) {
    try {
      const task = tasks.find((x) => x.id === id);
      if (task) {
        const updatedTask = await api.updateTask(id, data);
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updatedTask.data : t))
        );
      }
    } catch {}
  }

  async function _deleteTask(id: number) {
    try {
      await api.deleteTask(id);
      reloadTasks();
    } catch {}
  }

  // ----- Groups -----

  async function reloadGroups() {
    try {
      const response = await api.fetchGroups();
      localStorage.setItem("kairo_group_cache", JSON.stringify(response.data));
      setGroups(response.data);
    } catch {}
  }

  async function createGroup(name: string) {
    try {
      let n = await api.addGroup(name);
      setGroups((old) => {
        return [...old, n.data];
      });
      reloadGroups();
      setTimeout(() => {
        window.location.hash = `#group-${n.data.id}`;
      }, 300);
    } catch {}
  }

  async function _updateGroup(id: number, data: Partial<Group>) {
    try {
      await api.updateGroup(id, data);
      reloadGroups();
    } catch {}
  }

  // ----- Moods -----
  async function _createMoodEntry(entry: Partial<MoodLog>) {
    try {
      await api.addMoodEntry(entry);
    } catch {}
  }

  async function _fetchMoodEntries() {
    try {
      const result = await api.fetchMoodEntries();
      setMoods(result.data);

      if (
        DawnTime.formatDateString(
          new Date(result.data[result.data.length - 1].created_at),
          "YYYY-MM-DD"
        ) !== DawnTime.formatDateString(new Date(), "YYYY-MM-DD")
      ) {
        if (localStorage.getItem("kairo-prompt-mood") === "true")
          showMoodLogger();
      }
    } catch {}
  }

  return {
    tasks,
    groups,
    moods,
    reloadTasks,
    createTask,
    updateTask: _updateTask,
    deleteTask: _deleteTask,
    reloadGroups,
    createGroup,
    createMoodEntry: _createMoodEntry,
    fetchMoodEntries: _fetchMoodEntries,
    updateGroup: _updateGroup,
  };
}
