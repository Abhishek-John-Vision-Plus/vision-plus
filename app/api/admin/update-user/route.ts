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

    if (!requester || (requester.role !== "SUPER_ADMIN" && requester.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden: Only Admin or Super Admin can perform this action" }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, role, process: targetProcess, questionCount } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Target User ID is required" }, { status: 400 });
    }

    // If it's a regular ADMIN, verify they are updating a user in their own process
    if (requester.role === "ADMIN") {
      const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
      if (!targetUser || targetUser.process !== requester.process) {
        return NextResponse.json({ error: "Forbidden: You can only update users in your own process" }, { status: 403 });
      }
      
      // Regular ADMINs shouldn't be able to change roles or processes of other users
      if (role || targetProcess) {
        return NextResponse.json({ error: "Forbidden: Only Super Admin can change roles or processes" }, { status: 403 });
      }
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: {
        ...(role && { role }),
        ...(targetProcess && { process: targetProcess }),
        ...(questionCount !== undefined && { questionCount: parseInt(questionCount.toString()) }),
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
