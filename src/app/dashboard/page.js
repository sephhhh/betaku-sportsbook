"use client";
import Link from "next/link";
import Image from 'next/image';
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkCurrentUser, signOutUser } from "@/lib/firebase";
import { convertDecimalToAmerican, createGame } from "./oddsApi";
import gameData from "../../../game.json";

function createItem(game, market, outcome) {
  const homeTeam = game.home_team;
  const awayTeam = game.away_team;
  const odds = convertDecimalToAmerican(outcome.price)
  const type = market.key;
  const commence_time = formatToEST(game.commenceTime);

  return (
    <main>
      {homeTeam}
    </main>
  )
}

function createGameFromJson(betSlipRef, setCount, count) {
  const [games, setGames] = useState([]);
  const [items, setItems] = useState([]);
  const betButton = useRef(null);

  const handleBetButton = (game, market, outcome) => (e) => {
    e.preventDefault();
    function createItem(game, market, outcome) {
      const homeTeam = game.home_team;
      const awayTeam = game.away_team;
      const odds = convertDecimalToAmerican(outcome.price);
      const type = market.key;
      const commence_time = formatToEST(game.commenceTime);
  
      // Create a new item object
      const newItem = { homeTeam, awayTeam, odds, type, commence_time };
  
      // Add the new item to the list
      setItems(prevItems => [...prevItems, newItem]);
    }

    setCount(count + 1);
  }

  useEffect(() => {
    const formattedGames = gameData.slice(0, 14).map((game, index) => {
      const homeTeam = game.home_team;
      const awayTeam = game.away_team;
      const formattedHomeTeam = game.home_team.toLowerCase().replace(/ /g, "_");
      const formattedAwayTeam = game.away_team.toLowerCase().replace(/ /g, "_");
      const homeTeamLink = `/${formattedHomeTeam}.png`;
      const awayTeamLink = `/${formattedAwayTeam}.png`;
      const sameGameParlayLink = 'SGP.png';

      const markets = game.bookmakers[0]?.markets || [];    
      const updatedMarkets = markets.map((market) => {
        const updatedMarket = { ...market };
        if (market.key !== 'totals' && market.outcomes[0].name !== game.away_team)  {
          const [firstOutcome, secondOutcome] = updatedMarket.outcomes;
          updatedMarket.outcomes = [secondOutcome, firstOutcome]; // Swap
        }
        return updatedMarket;
      });
      const marketDetails = updatedMarkets.map((market) => ({
        key: market.key,
        outcomes: market.outcomes,
      }));

      return {
        id: index,
        homeTeam,
        awayTeam,
        formattedHomeTeam,
        formattedAwayTeam,
        homeTeamLink,
        awayTeamLink,
        sameGameParlayLink,
        commenceTime: game.commence_time,
        marketDetails,
      };
    });

    setGames(formattedGames);
  }, []);

  return (
    <div className="flex flex-col">
      {games.map((game) => (
        <div key={game.id} className="border-b border-black pb-[20px] mb-[20px]">
          <div className="flex">
            <div className="flex-1 min-w-[220px]">
              <div className="flex justify-start items-center">
                <img
                  src={game.awayTeamLink}
                  alt={`${game.awayTeam} logo`}
                  className="w-auto h-[33px] object-cover rounded"
                />
                <p>{game.awayTeam}</p>
              </div>
              <div className="flex items-center">
                @<div className="border-t border-black flex-1 ml-[2px]"></div>
              </div>
              <div className="flex justify-start items-center">
                <img
                  src={game.homeTeamLink}
                  alt={`${game.homeTeam} logo`}
                  className="w-auto h-[33px] object-cover rounded"
                />
                <p>{game.homeTeam}</p>
              </div>
            </div>
            <div className="flex min-w-[725px] w-[725px]">
              <div className="flex justify-around w-[100%]">
                {game.marketDetails.map((market) => (
                  <div key={market.key} className="flex flex-col justify-between">
                    {market.outcomes.map((outcome, i) => (
                      <div key={i}>
                        <button ref={betButton} className="w-[235px] border border-solid border-[blue]" onClick={handleBetButton(game, market, outcome)}>
                          <div key={i}>
                            {MyComponent(market, outcome)}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-[8px]">
              <img 
              src={game.sameGameParlayLink}
              alt="sgp logo"
              className="h-[24px] w-auto"/>
              <p>{formatToEST(game.commenceTime)}</p>
            </div>
            <div>More wagers </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatToEST(datetimeString) {
  // Create a new Date object from the input string
  const date = new Date(datetimeString);

  // Use Intl.DateTimeFormat to format the time
  const options = {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedTime = formatter.format(date);

  return `${formattedTime} EST`;
}

function MyComponent(market, outcome) {
  if (market.key === "h2h") {
    return <div>{convertDecimalToAmerican(outcome.price)}</div>;
  } else if (market.key === "spreads") {
    return (
      <div>
        <div>{outcome.point}</div>
        <div>{convertDecimalToAmerican(outcome.price)}</div>
      </div>
    );
  }
  return (
    <div>
      <div>{outcome.name.charAt(0)} {outcome.point}</div>
      <div>{convertDecimalToAmerican(outcome.price)}</div>
    </div>
  );
}



export default function Home() {
  const router = useRouter();
  const signoutButtonRef = useRef(null);
  const betSlipRef = useRef(null);
  const slipCountRef = useRef(null);
  const [count, setCount] = useState(0);

  const handleSignoutClick = (e) => {
    e.preventDefault();
    signOutUser();
    router.push('/');
  }

  return (
    <main className="flex w-screen pl-[40px] gap-[35px] bg-[#f1f3f7]">
      <div className="flex flex-grow flex-col mt-[10px] gap-[20px]">
        <div className="flex h-[45px] items-center pl-[20px] gap-[30px] shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px] bg-[#fff]">
          <button className="sportTitle">NFL</button><button className="sportTitle">NBA</button><button className="sportTitle">MLB</button><button className="sportTitle">NHL</button>
        </div>
        <div className="rounded-[5px] shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] bg-[#fff]">
          <div className="pl-[20px] pr-[20px] pt-[10px] pb-[10px] text-[20px] font-semibold">NFL Odds</div>
          <hr></hr>
          <div className="flex justify-between pl-[20px] pr-[20px] pt-[10px] pb-[10px] bg-[#f1f3f7]">
            <div className="w-[75px]">NFL</div>
            <div className="flex justify-around w-[725px]">
              <div className="text-[#788490]">MONEY</div>
              <div className="text-[#788490]">SPREAD</div>
              <div className="text-[#788490]">TOTAL</div>
            </div>
          </div>
          <hr></hr>
          <div className="overflow-auto min-h-[500px] max-h-[740px] pl-[20px] pr-[20px] pt-[10px] pb-[10px] hide-scrollbar">
            {createGameFromJson(betSlipRef, setCount, count)}
          </div>
        </div>
      </div>

      <div className="flex flex-col min-w-[400px] w-[450px] h-[912px] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
        <div className="flex items-center border-b-2 border-b-solid border-b-[#c8c8c8] p-[15px] bg-[#fff] mb-[15px]">
          <div ref={slipCountRef} className="w-[30px] h-[30px] bg-blue-500 text-white flex items-center justify-center rounded-full">{count}</div>
          <p className="flex align-center font-semibold">Betslip</p>
        </div>
        <div ref={betSlipRef} className="overflow-auto h-[650px] border-t-2 border-b-2 border-solid border-[#c8c8c8] p-[15px] bg-[#fff]"></div>
      

        <button
          ref={signoutButtonRef}
          className="fixed z-50 bottom-4 right-4 h-[40px] bg-white border border-solid border-black rounded-[5px] pl-[10px] pr-[10px] cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Sign out"
          onClick={handleSignoutClick}
        > Sign out
        </button>
      </div>
  </main>
  )
}