import { db } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...userData } = user;
    return userData;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
