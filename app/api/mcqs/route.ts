import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const process = searchParams.get("process");
    const id = searchParams.get("id");
    console.log("MCQ API params:", { process, id });
    if (id) {
      const mcq = await db.mcq.findUnique({
        where: { id },
      });
      return NextResponse.json({ mcq });
    }

    const where: any = {};
    if (process) where.process = { contains: process, mode: 'insensitive' };

    const mcqs = await db.mcq.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ mcqs });
  } catch (error: any) {
    console.error("FETCH_MCQS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, type, options, correctAnswer, process, category, module, role, userRole, userProcess } = body;

    // Backend validation: Non-superadmins can only create questions for their process
    const isSuperAdmin = userRole === 'SUPERADMIN' || userRole === 'ADMIN';
    if (!isSuperAdmin && process !== userProcess) {
      return NextResponse.json(
        { error: "Forbidden: You can only assign questions to your own process." },
        { status: 403 }
      );
    }

    const mcq = await db.mcq.create({
      data: {
        question,
        type: type || "MCQ",
        options: options || null,
        correctAnswer: correctAnswer || null,
        process: process || null,
        category: category || null,
        module: module || null,
        role: role || "BOTH",
      },
    });

    return NextResponse.json(mcq);
  } catch (error: any) {
    console.error("CREATE_MCQ_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, question, type, options, correctAnswer, process, category, module, role, userRole, userProcess } = body;

    // Backend validation
    const isSuperAdmin = userRole === 'SUPERADMIN' || userRole === 'ADMIN';
    if (!isSuperAdmin && process !== userProcess) {
       return NextResponse.json(
         { error: "Forbidden: You can only edit questions for your own process." },
         { status: 403 }
       );
    }

    const mcq = await db.mcq.update({
      where: { id },
      data: {
        question,
        type,
        options,
        correctAnswer,
        process,
        category,
        module,
        role,
      },
    });

    return NextResponse.json(mcq);
  } catch (error: any) {
    console.error("UPDATE_MCQ_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.mcq.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE_MCQ_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
