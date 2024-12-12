"use client";
import React, { useState, useRef } from "react";
import { register } from "@/lib/firebase";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const registerButton = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPassRef = useRef(null);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      passwordRef.current.value !== confirmPassRef.current.value ||
      passwordRef.current.value === "" ||
      confirmPassRef.current.value === ""
    ) {
      setErrorMessage("Passwords do not match or are empty.");
      setShowContent(false); // Hide content in case of error
    } else {
      setShowContent((prevState) => !prevState);
      console.log("Email:", emailRef.current.value);
      console.log("Password:", passwordRef.current.value);
      register(emailRef.current.value, passwordRef.current.value);
    }
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
              <div className="text-red-500 mt-4">{errorMessage}</div>
            )}

            <button ref={registerButton} type="submit" className="h-[40px] bg-white" onClick={handleRegisterClick}>Sign up</button>
          </div>
        </form>
      </div>
    </main>
  )
}