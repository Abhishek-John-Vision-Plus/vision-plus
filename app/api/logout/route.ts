import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  
  // Clear the userId cookie
  response.cookies.set("userId", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
