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
          processQuestionCounts[p.process] = p._count.id;
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

      // Fetch question count for their specific process
      const count = await db.mcq.count({
        where: { process: requester.process }
      });
      processQuestionCounts[requester.process] = count;
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
