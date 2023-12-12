"use client"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data, status } = useSession();
  const router = useRouter();
  return (
    <div>
      <button onClick={()=>status==="authenticated"?signOut():router.push("/login")}>
        {status==="authenticated"?"Sign Out":"Sign In"}
      </button>
    </div>
  )
}
