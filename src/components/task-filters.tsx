"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFilters } from "@/lib/api";

export default function TaskFiltersBar({
  filters, onChange,
}: { filters: TaskFilters; onChange: (f: TaskFilters) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search tasks..."
        className="w-64"
        value={filters.search ?? ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <Select
  value={filters.status ?? "all"}
  onValueChange={(v) => onChange({ ...filters, status: v ?? "all" })}
>
  <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All statuses</SelectItem>
    <SelectItem value="todo">To do</SelectItem>
    <SelectItem value="in_progress">In progress</SelectItem>
    <SelectItem value="done">Done</SelectItem>
  </SelectContent>
</Select>

<Select
  value={filters.priority ?? "all"}
  onValueChange={(v) => onChange({ ...filters, priority: v ?? "all" })}
>
  <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All priorities</SelectItem>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="high">High</SelectItem>
  </SelectContent>
</Select>
    </div>
  );
}