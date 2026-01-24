import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received data:", body);

    const {
      userId,
      firstName,
      lastName,
      phoneNumber,
      gender,
      state,
      city,
      dateOfBirth,
      teamLead,
      language,
      processAllocated,
      designation,
      address,
      consent,
    } = body;

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const userDetails = await db.userDetails.upsert({
      where: { userId },
      update: {
        firstName,
        lastName,
        phoneNumber,
        gender,
        state,
        city,
        dateOfBirth,
        teamLead,
        language,
        processAllocated,
        designation,
        address,
        consent,
        updatedAt: new Date(),
      },
      create: {
        userId,
        firstName,
        lastName,
        phoneNumber,
        gender,
        state,
        city,
        dateOfBirth,
        teamLead,
        language,
        processAllocated,
        designation,
        address,
        consent,
      },
    });

    return NextResponse.json({ message: "Details saved successfully", userDetails });
  } catch (error: any) {
    console.error("Error saving user details:", error);
    return NextResponse.json(
      { message: "Failed to save details", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const userDetails = await db.userDetails.findUnique({
      where: { userId },
    });

    if (!userDetails) {
      return NextResponse.json({ message: "User details not found" }, { status: 404 });
    }

    return NextResponse.json(userDetails, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
