"use client";
import Link from "next/link";
import Image from 'next/image';
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { checkCurrentUser, signOutUser } from "@/lib/firebase";
import { getNFLGames } from "./oddsApi";

let count = 0;

function createGame() {
  console.log*'hi';
}

export default function Home() {
  const router = useRouter();
  const signoutButtonRef = useRef(null);

  const handleSignoutClick = (e) => {
    e.preventDefault();
    signOutUser();
    router.push('/');
  }

  if (count === 0) {
    getNFLGames().then(games => {
      if (games) {
          for (const game in games) {
            if (game < 1) {
              const markets = games[game].bookmakers[0].markets;
              const homeTeam = games[game].home_team;
              const awayTeam = games[game].away_team;
              const commenceTime = games[game].commence_time;
              console.log(`${awayTeam} @ ${homeTeam}`);
              console.log(commenceTime);
              for (const marketNum in markets) {
                const market = markets[marketNum];
                const outcomes = market.outcomes;
                console.log(market.key)
                for (const outcome in outcomes) {
                  console.log(outcomes[outcome])
                }
              }
            }
          }
      } else {
          console.log('No games found.');
      }
    });
  }
  count++;

  return (
    <main className="grid grid-cols-[auto_450px] h-screen pl-[40px] gap-[35px] bg-[#f1f3f7]">
      <div className="flex flex-col mt-[10px] gap-[20px]">
        <div className="flex h-[45px] items-center pl-[20px] gap-[30px] shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px] bg-[#fff]">
          <button className="sportTitle">NFL</button><button className="sportTitle">NBA</button><button className="sportTitle">MLB</button><button className="sportTitle">NHL</button>
        </div>
        <div className="rounded-[5px] shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] bg-[#fff]">
          <div className="pl-[20px] pr-[20px] pt-[10px] pb-[10px] text-[20px] font-semibold">NFL Odds</div>
          <hr></hr>
          <div className="flex justify-between pl-[20px] pr-[20px] pt-[10px] pb-[10px] bg-[#f1f3f7]">
            <div className="sport">NFL</div>
            <div className="flex justify-around w-[800px]">
              <div className="text-[#788490]">SPREAD</div>
              <div className="text-[#788490]">MONEY</div>
              <div className="text-[#788490]">TOTAL</div>
            </div>
          </div>
          <hr></hr>
          <div className="pl-[20px] pr-[20px] pt-[10px] pb-[10px]">THIS IS THE ACTUAL CONTENT</div>
        </div>
      </div>

      <div className="betSlip">
        this is the bet slip
      </div>

       <button ref={signoutButtonRef} className="fixed bottom-4 right-4 h-[40px] bg-white border border-solid border-black rounded-[5px] pl-[10px] pr-[10px]" onClick={handleSignoutClick}>Signout</button>
    </main>
  )
}