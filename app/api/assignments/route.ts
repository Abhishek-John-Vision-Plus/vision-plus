import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    let user: any = null;
    if (userId) {
      user = await db.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await db.user.findUnique({ where: { email } });
    }
    if (!user) {
      return NextResponse.json({ assigned: [] });
    }

    const assigned = await db.assignedQuestion.findMany({
      where: { userId: user.id },
      select: { id: true, mcqId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ assigned });
  } catch (error: any) {
    console.error("ASSIGNMENTS_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const requesterId = cookieStore.get("userId")?.value;
    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requester = await db.user.findUnique({ where: { id: requesterId } });
    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mcqId, userEmail, userId } = body;
    if (!mcqId || (!userEmail && !userId)) {
      return NextResponse.json({ error: "mcqId and userEmail/userId required" }, { status: 400 });
    }

    const targetUser = userId
      ? await db.user.findUnique({ where: { id: userId } })
      : await db.user.findUnique({ where: { email: String(userEmail) } });
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const mcq = await db.mcq.findUnique({ where: { id: mcqId } });
    if (!mcq) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isSuper = requester.role === "SUPER_ADMIN";
    const isAdmin = requester.role === "ADMIN";
    if (!isSuper) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const sameProcess =
        requester.process &&
        targetUser.process &&
        requester.process.toLowerCase() === targetUser.process.toLowerCase();
      const mcqProcessMatch =
        requester.process &&
        mcq.process &&
        mcq.process.toLowerCase().includes(requester.process.toLowerCase());
      if (!sameProcess || !mcqProcessMatch) {
        return NextResponse.json(
          { error: "Admins can assign only within their process" },
          { status: 403 }
        );
      }
    }

    const created = await db.assignedQuestion.upsert({
      where: {
        userId_mcqId: { userId: targetUser.id, mcqId },
      },
      update: {},
      create: {
        userId: targetUser.id,
        mcqId,
        assignedBy: requester.id,
      },
    });
    return NextResponse.json({ success: true, assignment: created });
  } catch (error: any) {
    console.error("ASSIGNMENTS_POST_ERROR:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const requesterId = cookieStore.get("userId")?.value;
    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requester = await db.user.findUnique({ where: { id: requesterId } });
    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mcqId = searchParams.get("mcqId");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    if (!mcqId || (!userId && !email)) {
      return NextResponse.json({ error: "mcqId and userId/email required" }, { status: 400 });
    }

    const targetUser = userId
      ? await db.user.findUnique({ where: { id: userId } })
      : await db.user.findUnique({ where: { email: String(email) } });
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const isSuper = requester.role === "SUPER_ADMIN";
    const isAdmin = requester.role === "ADMIN";
    if (!isSuper) {
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const sameProcess =
        requester.process &&
        targetUser.process &&
        requester.process.toLowerCase() === targetUser.process.toLowerCase();
      if (!sameProcess) {
        return NextResponse.json(
          { error: "Admins can unassign only within their process" },
          { status: 403 }
        );
      }
    }

    await db.assignedQuestion.delete({
      where: { userId_mcqId: { userId: targetUser.id, mcqId } },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ASSIGNMENTS_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
