"use client";
import React, { useState, useRef, useEffect} from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { register, loginWithGoogle } from "@/lib/supabase";

export default function Home() {
  // Initiating variables
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerButton = useRef(null);
  const signupWithGoogleRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPassRef = useRef(null);

  // handleRegisterClick will run when users click the register button
  // on the register page
  const handleRegisterClick = async(e) => {
    e.preventDefault();
    setErrorMessage("");

    // This "if" statement will check if passwords match or is empty
    if (
      passwordRef.current.value !== confirmPassRef.current.value ||
      passwordRef.current.value === "" ||
      confirmPassRef.current.value === ""
    ) {
      setErrorMessage("Passwords do not match or are empty.");
      setShowContent(false);
    } else {
      
      // this is register user and if an error occurs it will
      // print out the error
      try {
        const user = await register(emailRef.current.value, passwordRef.current.value);
        sessionStorage.setItem("email", emailRef.current.value);
        console.log('Registered successfully');
        router.push('/dashboard');
        
      } catch (errorCode) {
        setShowContent((prevState) => !prevState);
        if (errorCode === 'auth/email-already-in-use') {
          setErrorMessage("Email already exists.");
        } else {
          alert(errorCode)
          setErrorMessage("An unexpected error occurred.");
        }
        setShowContent(false);
      }    
    }
  }

  // handleSignupWithGoogleClick will run when user clicks the register with
  // google and it will bring user to another page to register through google
  const handleSignupWithGoogleClick = async (e) => {
    e.preventDefault();
    console.log("Google sign-in button clicked");
  
    try {
      await loginWithGoogle();
      
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };
  

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
            <div className="text-center text-[25px] text-[white]">Register now</div>
            <div className="flex flex-col">
              <label htmlFor="email"></label>
              <input ref={emailRef} type="email" name="email" id="email" placeholder="EMAIL ADDRESS" className="h-[50px] rounded-t-[5px]" />
              <label htmlFor="password"></label>
              <input ref={passwordRef} type="password" name="password" id="password" placeholder="PASSWORD" className="h-[50px]" />
              <label htmlFor="confirmPass"></label>
              <input ref={confirmPassRef} type="password" name="confirmPass" id="confirmPass" placeholder="CONFIRM PASSWORD" className="h-[50px] rounded-b-[5px]" />
            </div>
            {errorMessage && (
              <div className="text-red-500">{errorMessage}</div>
            )}

            <button ref={registerButton} type="submit" className="h-[40px] bg-white" onClick={handleRegisterClick}>Sign up</button>
            <button ref={signupWithGoogleRef} className="flex justify-between box-border items-center rounded-[5px] bg-[white] p-[10px]" onClick={handleSignupWithGoogleClick}>
              Sign up with Google
              <Image src="/google-icon.jpg" alt="Google Icon" width={30} height={30} className="rounded-r-[5px]"/>
            </button>
            <div className="text-[white]">Have an account? <a href="/" className="text-[lightPink]"> Log in now</a></div>
          </div>
        </form>
      </div>
    </main>
  )
}