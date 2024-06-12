"use client";
import React from "react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function page() {
  const { data: session, status } = useSession();
  console.log("session data :", session);

  if (status === "authenticated")
    return (
      <>
        <div className="container px-2">
          {/* <h3>{data.username}</h3> */}
          <div className="text-center">Hello Admin!</div>
          <button className="mt-5" onClick={() => signOut()}>
            LogOut
          </button>
        </div>
      </>
    );

  if (status === "unauthenticated")
    return (
      <>
        <h1>You are not authorize to view this page</h1>
        <button className="mt-5" onClick={() => signIn()}>
          Back to Login
        </button>
      </>
    );
}
