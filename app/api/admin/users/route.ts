import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requester = await db.user.findUnique({
      where: { id: userId },
    });

    if (!requester || (requester.role !== "SUPER_ADMIN" && requester.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let users;
    let processQuestionCounts: Record<string, number> = {};

    if (requester.role === "SUPER_ADMIN") {
      // Super Admin sees everyone
      users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
      });

      // Fetch question counts for all processes
      const processes = await db.mcq.groupBy({
        by: ['process'],
        _count: {
          id: true
        }
      });
      processes.forEach(p => {
        if (p.process) {
          // Normalize the process name for consistent lookup (e.g., "ElderLine" or "Elder Line" -> "ELDERLINE")
          const normalizedKey = p.process.toUpperCase().replace(/\s+/g, '');
          processQuestionCounts[normalizedKey] = (processQuestionCounts[normalizedKey] || 0) + p._count.id;
        }
      });
    } else {
      // Admin only sees users in their process
      users = await db.user.findMany({
        where: {
          process: requester.process,
        },
        orderBy: { createdAt: "desc" },
      });

      // Fetch question count for their specific process (case-insensitive and space-insensitive)
      // Since we can't easily do a normalized count in a single Prisma call without raw SQL,
      // we'll fetch all counts and sum them.
      const allCounts = await db.mcq.groupBy({
        by: ['process'],
        _count: { id: true }
      });

      const normalizedRequesterProcess = requester.process.toUpperCase().replace(/\s+/g, '');
      let totalCount = 0;
      allCounts.forEach(p => {
        if (p.process && p.process.toUpperCase().replace(/\s+/g, '') === normalizedRequesterProcess) {
          totalCount += p._count.id;
        }
      });
      
      processQuestionCounts[normalizedRequesterProcess] = totalCount;
    }

    return NextResponse.json({ users, processQuestionCounts });
  } catch (error: any) {
    console.error("ADMIN_USERS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
