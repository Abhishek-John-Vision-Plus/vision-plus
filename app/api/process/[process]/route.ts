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
    let assignments: any[] = [];
    try {
      // @ts-ignore
      if (db.assignedQuestion) {
        // @ts-ignore
        assignments = await db.assignedQuestion.findMany({
          where: { userId },
          select: { mcqId: true },
        });
      }
    } catch (e) {
      console.warn("Could not fetch assigned questions (Model might be missing pending restart):", e);
    }

    let dbQuestions: any[] = [];
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
      const mappedQuestions = dbQuestions.map(q => ({
        id: q.id,
        question_text: q.question,
        type: q.type,
        options: typeof q.options === 'string' 
          ? (() => { try { return JSON.parse(q.options) } catch { return null } })() 
          : q.options,
        correct_option: q.correctAnswer || q.correctOption,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        category: q.category || "General",
        module: q.module || "General",
        role: q.role || "BOTH"
      }));

      // Randomize questions using Fisher-Yates shuffle
      for (let i = mappedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mappedQuestions[i], mappedQuestions[j]] = [mappedQuestions[j], mappedQuestions[i]];
      }

      // Limit based on user.questionCount
      const limitedQuestions = mappedQuestions.slice(0, 15);

      return NextResponse.json(limitedQuestions);
    }

    let selectedQuestions: any[] = [];

    switch (processName.toLowerCase()) {
      case "elderline":
        // Filter elderline questions based on user role (CO or FRO)
        const userRole = user.role.toUpperCase();
        if (userRole === "CO" || userRole === "FRO") {
          selectedQuestions = elderQuestions.filter(
            (q) => q.role === userRole || q.role === "BOTH"
          );
        } else {
          selectedQuestions = [...elderQuestions];
        }
        break;
      case "aadhar":
        selectedQuestions = [...aadhaarQuestions];
        break;
      case "bsnl":
        selectedQuestions = [...bsnlQuestions];
        break;
      case "gst":
        selectedQuestions = [...gstQuestions];
        break;
      default:
        // Instead of 404 immediately, return empty array to be handled by UI
        selectedQuestions = [];
        break;
    }

    if (selectedQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions added for this process yet." },
        { status: 404 }
      );
    }

    // Randomize static questions
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }

    // Limit based on user.questionCount
    const limitedStaticQuestions = selectedQuestions.slice(0, 15);

    return NextResponse.json(limitedStaticQuestions);
  } catch (error: any) {
    console.error("Process API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};
