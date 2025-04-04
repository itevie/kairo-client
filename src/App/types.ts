export interface User {
  id: number;
  settings: string;
}

export interface Task {
  id: number;
  user: number;
  title: string;
  finished: boolean;
  created_at: string;
  due: string | null;
  repeat: number | null;
  in_group: number | null;
  note: string | null;
  tags: string | null;
}

export interface Group {
  id: number;
  user: number;
  name: string;
  note: string | null;
  theme: string | null;
}

export interface MoodLog {
  id: number;
  user: number;
  emotion: string;
  note: string | null;
  created_at: string;
}

export interface Streak {
  id: number;
  user: number;
  title: string;
  note: string | null;
  type: "add" | "subtract";
  start: string;
  last_entry: string;
}
