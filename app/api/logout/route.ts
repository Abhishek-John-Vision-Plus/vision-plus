import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  
  // Clear the userId cookie
  response.cookies.set("userId", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  // Invalidate all server-side cached data
  revalidatePath("/", "layout");

  return response;
}
