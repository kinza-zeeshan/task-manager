import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, TaskFilters } from "@/lib/api";
import { TaskInput } from "@/lib/schema";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (f: TaskFilters) => ["tasks", "list", f] as const,
  detail: (id: number) => ["tasks", "detail", id] as const,
};

export const useTasks = (filters: TaskFilters) =>
  useQuery({ queryKey: taskKeys.list(filters), queryFn: () => api.list(filters) });

export const useTask = (id: number) =>
  useQuery({ queryKey: taskKeys.detail(id), queryFn: () => api.get(id), enabled: !!id });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: TaskInput) => api.create(d),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

export const useUpdateTask = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: TaskInput) => api.update(id, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
};