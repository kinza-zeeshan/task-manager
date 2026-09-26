import { NextRequest, NextResponse } from "next/server";
import { getPool, sql } from "@/lib/db";
import { taskSchema } from "@/lib/schema";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const map = (r: any) => ({
  id: r.Id,
  title: r.Title,
  description: r.Description ?? "",
  status: r.Status,
  priority: r.Priority,
  dueDate: r.DueDate ? new Date(r.DueDate).toISOString().slice(0, 10) : "",
  createdAt: r.CreatedAt,
  updatedAt: r.UpdatedAt,
});

export async function GET(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, Number(id))
    .query("SELECT * FROM Tasks WHERE Id = @id");
  if (!r.recordset[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(map(r.recordset[0]));
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const parsed = taskSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const t = parsed.data;
  const pool = await getPool();
  const r = await pool
    .request()
    .input("id", sql.Int, Number(id))
    .input("title", sql.NVarChar(200), t.title)
    .input("description", sql.NVarChar(sql.MAX), t.description || null)
    .input("status", sql.NVarChar(20), t.status)
    .input("priority", sql.NVarChar(20), t.priority)
    .input("dueDate", sql.Date, t.dueDate ? new Date(t.dueDate) : null)
    .query(`
      UPDATE Tasks
      SET Title=@title, Description=@description, Status=@status,
          Priority=@priority, DueDate=@dueDate, UpdatedAt=SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE Id=@id
    `);
  if (!r.recordset[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(map(r.recordset[0]));
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, Number(id))
    .query("DELETE FROM Tasks WHERE Id = @id");
  if (r.rowsAffected[0] === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}