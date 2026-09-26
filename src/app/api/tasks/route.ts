import { NextRequest, NextResponse } from "next/server";
import { getPool, sql } from "@/lib/db";
import { taskSchema } from "@/lib/schema";

export const runtime = "nodejs";

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

// GET /api/tasks?status=todo&priority=high&search=abc
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status");
    const priority = sp.get("priority");
    const search = sp.get("search");

    const pool = await getPool();
    const request = pool.request();
    let query = "SELECT * FROM Tasks WHERE 1=1";

    if (status && status !== "all") {
      query += " AND Status = @status";
      request.input("status", sql.NVarChar(20), status);
    }
    if (priority && priority !== "all") {
      query += " AND Priority = @priority";
      request.input("priority", sql.NVarChar(20), priority);
    }
    if (search) {
      query += " AND (Title LIKE @search OR Description LIKE @search)";
      request.input("search", sql.NVarChar(200), `%${search}%`);
    }
    query += " ORDER BY CreatedAt DESC";

    const result = await request.query(query);
    return NextResponse.json(result.recordset.map(map));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = taskSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const t = parsed.data;
    const pool = await getPool();
    const result = await pool
      .request()
      .input("title", sql.NVarChar(200), t.title)
      .input("description", sql.NVarChar(sql.MAX), t.description || null)
      .input("status", sql.NVarChar(20), t.status)
      .input("priority", sql.NVarChar(20), t.priority)
      .input("dueDate", sql.Date, t.dueDate ? new Date(t.dueDate) : null)
      .query(`
        INSERT INTO Tasks (Title, Description, Status, Priority, DueDate)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @status, @priority, @dueDate)
      `);
    return NextResponse.json(map(result.recordset[0]), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}