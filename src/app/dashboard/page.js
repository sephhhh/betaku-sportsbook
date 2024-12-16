"use client";
import Link from "next/link";
import Image from 'next/image';
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { checkCurrentUser, signOutUser } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();
  const signoutButtonRef = useRef(null);

  const handleSignoutClick = (e) => {
    e.preventDefault();
    signOutUser();
    router.push('/');
  }

  return (
    <main className="h-screen flex justify-center items-center">
       <button ref={signoutButtonRef} className="h-[40px] bg-white" onClick={handleSignoutClick}>Signout</button>
    </main>
  )
}