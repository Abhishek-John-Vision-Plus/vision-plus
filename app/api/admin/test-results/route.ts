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

    let results;
    if (requester.role === "SUPER_ADMIN") {
      // Super Admin sees all results
      results = await db.assessmentResult.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              empId: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Admin only sees results for their process
      results = await db.assessmentResult.findMany({
        where: {
          process: requester.process,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              empId: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("ADMIN_TEST_RESULTS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
