"use client";
import Link from "next/link";
import React, { useRef } from "react";
import { login } from "@/lib/firebase";

export default function Home() {
  const loginButtonRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const rememberMeRef = useRef(null);

  const handleLoginClick = (e) => {
    e.preventDefault();
    login(emailRef.current.value, passwordRef.current.value);
  }

  return (
    
    <main className="h-screen flex justify-center items-center">
       <div
        style={{
          backgroundImage: "url('/login-bg.jpg')", // Corrected the image path
          backgroundSize: 'cover', // Ensure the image covers the entire background
          backgroundPosition: 'center', // Centers the image
          height: '100vh', // Full viewport height
          position: 'absolute', // Position behind the form
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      ></div>
      <div className="w-[420px] h-[500px] box-border bg-[#252525] p-[20px] rounded-[5px]">
        <form>
          <div className="flex flex-col gap-[10px]">
            <div className="text-center text-[25px] text-[white]">Log in to my sportsbook</div>
            <div className="flex flex-col">
              <label htmlFor="email"></label>
              <input ref={emailRef} type="email" name="email" id="email" placeholder="EMAIL ADDRESS" className="h-[50px] rounded-t-[5px]" />
              <label htmlFor="password"></label>
              <input ref={passwordRef} type="password" name="password" id="password" placeholder="PASSWORD" className="h-[50px] rounded-b-[5px]" />
            </div>
            <label className="text-[white]">
              <input ref={rememberMeRef} type="checkbox" name="remember" id="remember" />Remember me
            </label>

            <button ref={loginButtonRef} type="submit" className="h-[40px] bg-white" onClick={handleLoginClick}>Log in</button>
            <a href="#" className="text-[white]">Forgot your password?</a>
          </div>
        </form>
        <div className="text-[white]">Don't have an account? <a href="/register" className="text-[lightPink]"> Sign up now</a></div>
      </div>
    </main>
  )
}