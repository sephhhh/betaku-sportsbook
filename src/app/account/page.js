"use client";
import Image from 'next/image';
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { checkCurrentUser, signOutUser } from "@/lib/firebase";


export default function Home() {
  const router = useRouter();
  const dashboardButtonRef = useRef(null);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  }


  return (
    
    <main className="h-screen flex flex-col pt-[20px]">
      <div className='flex justify-center  w-[100%]'>
        <button ref={dashboardButtonRef} className='mr-[150px] text-[25px]' onClick={handleDashboardClick}>&larr;</button>
        <div className='mr-[150px] text-[25px]'>Balance</div>
      </div>
      <div className='flex p-[30px] h-[100%] gap-[30px]'>
        <div className='grid grid-cols-1 grid-rows-none w-[35%] border'>
          <button className='accountButtons'>Balance</button>
          <button className='accountButtons'>Account Details</button>
          <button className='accountButtons'>Account Settings</button>
          <button className='accountButtons'>Change Email</button>
          <button className='accountButtons'>Change Password</button>
          <button className='accountButtons'>Email Notifications</button>
          <button className='accountButtons'>Close Account</button>
        </div>

        <div className='flex flex-col w-[100%] border'>
          <div className='flex flex-col items-center pt-[15px] pb-[30px]'>
            <div className='text-[30px]'>Playable Balance</div>
            <div className='text-[30px]'>$XX.XX</div>
            <div className='flex mt-[20px] gap-[25px]'>
              <div className='flex flex-col items-center'>
                <button className='border rounded-[50px]'>
                  <img src="/deposit-icon.svg" alt='Deposit' width={90} height={90} className='p-[5px]'/>
                </button>
                <div className='text-[20px]'>Deposit</div>
              </div>
              <div className='flex flex-col items-center'>
                <button className='border rounded-[50px]'>
                  <img src="/withdraw-icon.svg" alt='Withdraw' width={90} height={90} className='p-[15px]'/>
                </button>
                <div className='text-[20px]'>Withdraw</div>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="flex flex-col pl-[20px] pt-[10px]">
            <div className='text-[20px] font-semibold'>Wallet</div>
            <div className='flex flex-col mt-[15px]'>
              <button className='walletButtons'>
                <div>Transaction History</div>
                <div>&gt;</div>
              </button>
              <hr></hr>
              <button className='walletButtons'>
                <div>Statements</div>
                <div>&gt;</div>
                </button>
              <hr></hr>
              <button className='walletButtons'>
                <div>Tax Center</div>
                <div>&gt;</div>
                </button>
            </div>
            <hr></hr>
          </div>

          <div className="flex flex-1 flex-col items-center justify-between pb-[10px]">
            <div className="flex-grow flex items-center justify-center">chat r u up?</div>
            <div>Terms and conditions</div>
          </div>

        </div>

      </div>

    </main>
  )
}