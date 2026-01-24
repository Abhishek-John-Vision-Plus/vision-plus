import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, empId, password, process: selectedProcess, phone, role } = body;

    const nameStr = String(name || "").trim();
    const emailStr = String(email || "").trim();
    const empIdStr = String(empId || "").trim();
    const passwordStr = String(password || "").trim();

    // ✅ Validate required fields
    if (!nameStr || !emailStr || !empIdStr || !passwordStr || !selectedProcess) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Determine default role based on process if not provided
    let finalRole = role || "USER";
    if (!role && selectedProcess.toLowerCase() === "elderline") {
      finalRole = "CO";
    }

    // ✅ Create or Update user (Upsert behavior) to avoid 409 conflicts
    const user = await db.user.upsert({
      where: {
        email: emailStr,
      },
      update: {
        name: nameStr,
        empId: empIdStr,
        password: passwordStr,
        process: selectedProcess,
        phone: phone ? String(phone).trim() : null,
        role: finalRole,
      },
      create: {
        name: nameStr,
        email: emailStr,
        empId: empIdStr,
        password: passwordStr,
        process: selectedProcess,
        phone: phone ? String(phone).trim() : null,
        role: finalRole,
      },
    });

    const { password: _, ...userData } = user;
    const response = NextResponse.json({ 
      message: "Success", 
      user: userData 
    });
    
    // Set a cookie for the userId to allow server-side access in other routes
    response.cookies.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("FULL_SIGNUP_ERROR:", error);
    console.error("ERROR_CODE:", error.code);
    console.error("ERROR_MESSAGE:", error.message);

    // Provide more specific error messages for Prisma errors
    let errorMessage = "Failed to create user";
    let errorDetails = error.message;

    if (error.code === 'P1001') {
      errorMessage = "Database connection failed. Please ensure the database is reachable.";
      return NextResponse.json({ error: errorMessage }, { status: 503 });
    } else if (error.code === 'P2002') {
      errorMessage = "A user with this email or Employee ID already exists.";
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    );
  }
}
