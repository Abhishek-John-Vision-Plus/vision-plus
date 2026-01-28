import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("DATABASE_URL defined:", !!process.env.DATABASE_URL);
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL);
      console.log("DB Host:", url.hostname);
    }
    const body = await req.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/Employee ID and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { empId: { equals: email, mode: 'insensitive' } }
        ]
      },
    });

    console.log(`Login attempt for: ${email}`);
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      console.log('Password mismatch');
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log('Login successful for:', user.email);

    // In a real app, you would create a session or JWT here
    const { password: _, ...userData } = user;
    
    const response = NextResponse.json({ message: "Login successful", user: userData });
    
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
    console.error("LOGIN_ERROR:", error);
    
    // Provide more specific error messages for Prisma errors
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure the database is reachable." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
