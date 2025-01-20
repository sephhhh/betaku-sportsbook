"use client";
import Image from 'next/image';
import React, { useState, useRef } from "react";
import { loginWithGoogle, projectId } from '@/lib/supabase';
import { login } from '@/lib/supabase';
import { useRouter } from "next/navigation";

import { checkCurrentUser, signOutUser } from "@/lib/firebase";

export default function Home() {
  // Initiating variables
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loginButtonRef = useRef(null);
  const loginWithGoogleRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const rememberMeRef = useRef(null);


  // handleLoginClick is what will happen when the login button is clicked on the login screen
  const handleLoginClick = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    // This will login users in if they have an account and will print out an error if they don't
    try {
      const user = await login(emailRef.current.value, passwordRef.current.value);
      router.push('/dashboard');
    } catch (errorCode) {
      console.log(errorCode);
      setShowContent((prevState) => !prevState);
      if (errorCode === 'AuthApiError: Invalid login credentials') {
        setErrorMessage("Email or password is incorrect");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
     setShowContent(false);
    } 
  }

  // handleLoginWithGoogleClick will happen when user clicks the login with google button
  // and it will bring them to a page to login with google
  const handleLoginWithGoogleClick = (e) => {
    e.preventDefault();
    loginWithGoogle();
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
            {errorMessage && (
              <div className="text-red-500">{errorMessage}</div>
            )}
            <label className="text-[white]">
              <input ref={rememberMeRef} type="checkbox" name="remember" id="remember" />Remember me
            </label>

            <button ref={loginButtonRef} type="submit" className="h-[40px] bg-white" onClick={handleLoginClick}>Log in</button>
            <a href="#" className="text-[white]">Forgot your password?</a>

            <button ref={loginWithGoogleRef} className="flex justify-between box-border items-center rounded-[5px] bg-[white] p-[10px]" onClick={handleLoginWithGoogleClick}>
              Log in with Google
              <Image src="/google-icon.jpg" alt="Google Icon" width={30} height={30} className="rounded-r-[5px]"/>
            </button>
          </div>
        </form>
        <div className="text-[white]">Don't have an account? <a href="/register" className="text-[lightPink]"> Sign up now</a></div>
      </div>
    </main>
  )
}