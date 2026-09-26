"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTable from "@/components/task-table";
import TaskFiltersBar from "@/components/task-filters";
import { useTasks } from "@/hooks/use-tasks";
import { TaskFilters } from "@/lib/api";

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ status: "all", priority: "all", search: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search ?? ""), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const { data, isLoading, error } = useTasks({ ...filters, search: debouncedSearch });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button nativeButton={false} render={<Link href="/tasks/new" />}>Add Task</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <TaskFiltersBar filters={filters} onChange={setFilters} />
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-destructive">{(error as Error).message}</p>}
        {data && <TaskTable tasks={data} />}
      </CardContent>
    </Card>
  );
}