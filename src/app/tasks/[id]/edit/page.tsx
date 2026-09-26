"use client";
import { use } from "react";
import TaskForm from "@/components/task-form";
import { useTask } from "@/hooks/use-tasks";

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useTask(Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p className="text-destructive">Task not found.</p>;
  return <TaskForm task={data} />;
}