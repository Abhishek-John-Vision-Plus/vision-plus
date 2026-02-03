import { questions as elderQuestions } from "@/data/elder-question";
import { bsnlQuestions } from "@/data/bsnl-question";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { aadhaarQuestions } from "@/data/aadhar-question";
import { gstQuestions } from "@/data/gst-question";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ process: string }> }
) => {
  try {
    const { process: processPath } = await params;
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
    
    // Support process from query param or path
    const processName = searchParams.get("process") || processPath;
    const id = searchParams.get("id");
    
    // Check for userId in query params first, then in cookies
    const userId = searchParams.get("userId") || cookieStore.get("userId")?.value;

    // If an ID is provided, fetch that specific MCQ (no userId required for single question view if needed)
    if (id) {
      const mcq = await db.mcq.findUnique({
        where: { id },
      });
      if (mcq) {
        return NextResponse.json({
          id: mcq.id,
          question_text: mcq.question,
          type: mcq.type,
          options: mcq.options,
          correct_option: mcq.correctAnswer || mcq.correctOption,
          option_a: mcq.option_a,
          option_b: mcq.option_b,
          option_c: mcq.option_c,
          option_d: mcq.option_d,
          category: mcq.category || "General",
          module: mcq.module || "General",
          role: mcq.role || "BOTH"
        });
      }
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User identification required. Please log in." },
        { status: 401 }
      );
    }

    // Fetch user to verify process and role
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    // Verify user is assigned to this process
    // Using case-insensitive comparison for process names
    if (user.process.toLowerCase() !== processName.toLowerCase()) {
      return NextResponse.json(
        { message: `Access denied. You are assigned to the '${user.process}' process, not '${processName}'.` },
        { status: 403 }
      );
    }

    // Check for assigned questions to this user first
    const assignments = await db.assignedQuestion.findMany({
      where: { userId },
      select: { mcqId: true },
    });
    let dbQuestions;
    if (assignments.length > 0) {
      const ids = assignments.map(a => a.mcqId);
      dbQuestions = await db.mcq.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: 'asc' }
      });
    } else {
      // Fallback to process-based questions
      dbQuestions = await db.mcq.findMany({
        where: {
          process: {
            contains: processName,
            mode: 'insensitive'
          }
        },
        orderBy: { createdAt: 'asc' }
      });
    }

    if (dbQuestions.length > 0) {
      // Map DB questions to a consistent format
      return NextResponse.json(dbQuestions.map(q => ({
        id: q.id,
        question_text: q.question,
        type: q.type,
        options: q.options,
        correct_option: q.correctAnswer || q.correctOption,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        category: q.category || "General",
        module: q.module || "General",
        role: q.role || "BOTH"
      })));
    }

    let selectedQuestions;

    switch (processName.toLowerCase()) {
      case "elderline":
        // Filter elderline questions based on user role (CO or FRO)
        const userRole = user.role.toUpperCase();
        if (userRole === "CO" || userRole === "FRO") {
          selectedQuestions = elderQuestions.filter(
            (q) => q.role === userRole || q.role === "BOTH"
          );
        } else {
          selectedQuestions = elderQuestions;
        }
        break;
      case "aadhar":
        selectedQuestions = aadhaarQuestions;
        break;
      case "bsnl":
        selectedQuestions = bsnlQuestions;
        break;
      case "gst":
        selectedQuestions = gstQuestions;
        break;
      default:
        return NextResponse.json(
          { message: `No questionnaire found for process: ${processName}` },
          { status: 404 }
        );
    }

    return NextResponse.json(selectedQuestions);
  } catch (error: any) {
    console.error("Process API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
