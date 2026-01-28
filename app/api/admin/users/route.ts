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
    if (requester.role === "SUPER_ADMIN") {
      // Super Admin sees everyone
      users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Admin only sees users in their process
      users = await db.user.findMany({
        where: {
          process: requester.process,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("ADMIN_USERS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
