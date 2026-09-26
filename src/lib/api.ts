import { Task, TaskInput } from "./schema";

export type TaskFilters = { status?: string; priority?: string; search?: string };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Request failed");
  return res.json();
}

export const api = {
  list: (f: TaskFilters = {}) => {
    const qs = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => v && qs.set(k, v));
    return fetch(`/api/tasks?${qs}`).then(r => handle<Task[]>(r));
  },
  get: (id: number) => fetch(`/api/tasks/${id}`).then(r => handle<Task>(r)),
  create: (data: TaskInput) =>
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => handle<Task>(r)),
  update: (id: number, data: TaskInput) =>
    fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => handle<Task>(r)),
  remove: (id: number) =>
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then(r => handle<{ success: true }>(r)),
};