"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Task } from "@/lib/schema";
import { useDeleteTask } from "@/hooks/use-tasks";

const statusLabel = { todo: "To do", in_progress: "In progress", done: "Done" } as const;
const priorityVariant = { low: "secondary", medium: "outline", high: "destructive" } as const;

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  const del = useDeleteTask();

  if (!tasks.length) {
    return <p className="py-10 text-center text-muted-foreground">No tasks found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t) => (
          <TableRow key={t.id}>
            <TableCell>
              <div className="font-medium">{t.title}</div>
              {t.description && (
                <div className="line-clamp-1 text-xs text-muted-foreground">{t.description}</div>
              )}
            </TableCell>
            <TableCell><Badge variant="secondary">{statusLabel[t.status]}</Badge></TableCell>
            <TableCell><Badge variant={priorityVariant[t.priority]}>{t.priority}</Badge></TableCell>
            <TableCell>{t.dueDate || "—"}</TableCell>
            <TableCell className="text-right">
              <Button nativeButton={false} render={<Link href={`/tasks/${t.id}/edit`} />} size="icon" variant="ghost">
  <Pencil className="h-4 w-4" />
</Button>
              <AlertDialog>
                <AlertDialogTrigger render={<Button size="icon" variant="ghost" />}>
  <Trash2 className="h-4 w-4 text-destructive" />
</AlertDialogTrigger> 
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        del.mutate(t.id, {
                          onSuccess: () => toast.success("Task deleted"),
                          onError: (e) => toast.error(e.message),
                        })
                      }
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}