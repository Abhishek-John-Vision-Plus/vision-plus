import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requester = await db.user.findUnique({
      where: { id: userId },
    });

    if (!requester || requester.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only Super Admin can perform this action" }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, role, process: targetProcess } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Target User ID is required" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: {
        ...(role && { role }),
        ...(targetProcess && { process: targetProcess }),
      },
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("ADMIN_UPDATE_USER_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
