import HomePage from "./_components/Home";
import { getCurrentUser } from "@/lib/auth-server";
import { db } from "@/lib/prisma";

export default async function Home() {
  const user = await getCurrentUser();
  let userDetails = null;

  if (user?.id) {
    userDetails = await db.userDetails.findUnique({
      where: { userId: user.id },
    });
  }

  return (
    <div className='h-full py-4'>
      <HomePage initialUserDetails={userDetails} />
    </div>
  );
}
