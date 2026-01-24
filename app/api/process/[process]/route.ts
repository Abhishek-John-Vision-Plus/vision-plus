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
    const { process: processName } = await params;
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
    
    // Check for userId in query params first, then in cookies
    const userId = searchParams.get("userId") || cookieStore.get("userId")?.value;

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