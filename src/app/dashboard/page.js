"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, projectId, supabase } from "@/lib/supabase";
import { convertDecimalToAmerican, createGame } from "./oddsApi";
import gameData from "../../../game.json";

// createItem will create a new bet item like for an example moneyline for
// a NFL game and return a react component
function createItem(game, market, outcome, key, betItemRef, removeBet) {
  const homeTeam = game.homeTeam;
  const awayTeam = game.awayTeam;
  const odds = convertDecimalToAmerican(outcome.price)
  const type = market.key;
  const commence_time = formatToEST(game.commenceTime);


  const handleRemoveBet = (e) => {
    e.preventDefault();
    removeBet(key);
  }

  if (type === 'h2h') {
    return (
      <div ref={betItemRef} className="grid grid-cols-[17px_1fr] gap-[15px] pt-[20px] pb-[20px] border-b border-solid border-[#c8c8c8]">
        <button className="flex items-start pt-[6px] h-[17px] w-auto" onClick={handleRemoveBet}>
            <img src="delete.png" alt="Delete" className="h-[17px] w-auto"/>
        </button>
        <div className="flex flex-col w-[100%] box-border">
          <div className="flex justify-between items-center">
            <div className="text-[18px] font-semibold">{outcome.name}</div>
            <div className="font-bold">{odds}</div>
          </div>
          <div className="text-[14px] text-[#788490]">MONEYLINE</div>
          <div className="flex justify-between">
            <div className="text-[14px]">{homeTeam} @ {awayTeam}</div>
            <div className="text-[14px] text-[#788490]">{commence_time}</div>
          </div>
        </div>
      </div>
    )
  } else if (type === 'spreads') {
      return type;
  }
  return type;
}

// createGameFromJson is basically fetching the NFL games from the temporary games.json
// and returning a react component
function createGameFromJson(setBetItems, betItems, increment, decrement, betObjects, setBetObjects, updateTotalOdds, placeBetButtonRef, userInputRef, buttonContentRef, otherButtonContentRef) {
  const [games, setGames] = useState([]);
  const betButton = useRef(null);
  const betItemRef = useRef(null);


  // removeBet will run when user clicks the delete button next to the bet item
  // and this will delete the betting item off the bet slip
  const removeBet = (key) => {
    setBetItems((prevBetItems) => prevBetItems.filter((bet) => bet.key !== key));
    setBetObjects((prevBetObjects) => {
      const updatedBetObjects = prevBetObjects.filter((bet) => bet.key !== key);
      updateTotalOdds(updatedBetObjects);
      if (updatedBetObjects.length === 0) {
        placeBetButtonRef.current.className = 'h-[100%] w-[100%] bg-[#bf1216]'
        buttonContentRef.current.className = "visible text-[#fff]";
        otherButtonContentRef.current.className = "hidden";
      }
      return updatedBetObjects;
    });
    decrement();
  };

  // addBet will run when user clicks on the "bet" they want to place such a moneyline on game
  // and this will add that bet item to the bet slip
  const addBet = (game, market, outcome) => (e) => {
    e.preventDefault();
    const itemKey = `${game.id}-${market.key}`;
    const item = createItem(game, market, outcome, itemKey, betItemRef, removeBet);

    setBetItems((prevBetItems) => {
      const updatedBetItems = [...prevBetItems, <div key={itemKey}>{item}</div>];
      return updatedBetItems;
    });

    const newBetObject = { game, market, outcome, key: itemKey };
    setBetObjects((prevBetObjects) => {
      const updatedBetObjects = [...prevBetObjects, newBetObject];
      updateTotalOdds(updatedBetObjects);
      return updatedBetObjects;
    });
    increment();
    if (userInputRef.current.value !== '') {
      placeBetButtonRef.current.className = "h-[100%] w-[100%] bg-[#2a8d2f]";
      buttonContentRef.current.className = "hidden";
      otherButtonContentRef.current.className = "visible flex flex-col text-[#fff]";
    }
  }

  // This will create the games for the upcoming week, returning a react component
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
                        <button ref={betButton} className="w-[235px] border border-solid border-[blue]" onClick={addBet(game, market, outcome)}>
                          <div key={i}>
                            {betItem(market, outcome)}
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

// This is to formate the time to EST
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

// This will create the react component for the betting item
function betItem(market, outcome) {
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
  // Initiating variables
  const router = useRouter();
  const signoutButtonRef = useRef(null);
  const accountButtonRef = useRef(null);
  const placeBetButtonRef = useRef(null);
  const buttonContentRef = useRef(null);
  const otherButtonContentRef = useRef(null);
  const betSlipRef = useRef(null);
  const slipCountRef = useRef(null);
  const userInputRef = useRef(null);
  const toWinRef = useRef(null);
  const [count, setCount] = useState(0);
  const [totalDecimalOdds, setTotalDecimalOdds] = useState(0);
  const [totalOdds, setTotalOdds] = useState(0);
  const [userAmount, setUserAmount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [betItems, setBetItems] = useState([]);
  const [betObjects, setBetObjects] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting user:", error);
      } else {
        if (user.user.app_metadata.provider === 'google') {
          alert('from google');
        }
      }
    };

    fetchUser();
  }, []);


  // This will increment the count on the bet slip for the number of
  // betting items
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // This will decrement the count on the bet slip for the number of
  // betting items
  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  // handleAccountClick will run when the user clicks the account button which
  // will route them to their account page
  const handleAccountClick = (e) => {
    e.preventDefault();
    router.push('/account');
  }

  // Signs out user
  const handleSignoutClick = (e) => {
    e.preventDefault();
    signOut();
    router.push('/');
  }

  // This will update the total odds for the bet slip as the user adds or deletes an item
  const updateTotalOdds = (updatedBetObj) => {
    console.log(updatedBetObj)
    if (updatedBetObj.length === 0) {
      setTotalOdds(0);
      setTotalDecimalOdds(0);
      toWinRef.current.value = '';
      buttonContentRef.current.className = "visible text-[#fff]";
      return;
    }
    let totalDecimalOdds = 1;
    for (const bet in updatedBetObj) {
      totalDecimalOdds *= updatedBetObj[bet].outcome.price;
    }
    const roundedTotalDecimalOdds = Number(totalDecimalOdds.toFixed(2));
    const totalAmericanOdds = convertDecimalToAmerican(roundedTotalDecimalOdds);
    setTotalDecimalOdds(roundedTotalDecimalOdds);
    console.log(roundedTotalDecimalOdds)
    setTotalOdds(totalAmericanOdds);

  }


  const handlePlaceBet = (e) => {
    e.preventDefault();
    alert('hi');
  }

  // handleUserInput will run when user puts an amount of money they want to wager on the
  // bet slip and will output the profit
  const handleUserInput = (e) => {
    if (e.target.value === '') {
      placeBetButtonRef.current.className = "h-[100%] w-[100%] bg-[#bf1216]";
      buttonContentRef.current.className = "visible text-[#fff]";
      otherButtonContentRef.current.className = "hidden";
      toWinRef.current.value = '';
    } else {
      if (totalDecimalOdds !== 0) {
        const payOut = e.target.value * totalDecimalOdds;
        const toWin = payOut - e.target.value;
        setUserAmount(e.target.value);
        setProfit( Number(toWin.toFixed(2)));
        toWinRef.current.value = Number(toWin.toFixed(2));
        if (betSlipRef.current.childNodes.length !== '') {
          placeBetButtonRef.current.className = "h-[100%] w-[100%] bg-[#2a8d2f]";
          buttonContentRef.current.className = "hidden";
          otherButtonContentRef.current.className = "visible flex flex-col text-[#fff]";
        }
      } else {
        buttonContentRef.current.className = "visible text-[#fff]";
        otherButtonContentRef.current.className = "hidden";
      }
    }
  }

  // create refs and a variable in order to dynamically change the height of the
  // games dashboard
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const hr1Ref = useRef(null);
  const subheaderRef = useRef(null);
  const hr2Ref = useRef(null);
  const [scrollableHeight, setScrollableHeight] = useState(0);

  // dynamically change the height of the games dashboard based on the other components
  // in that container
  useEffect(() => {
    if (
      containerRef.current &&
      headerRef.current &&
      hr1Ref.current &&
      subheaderRef.current &&
      hr2Ref.current
    ) {
      // Get the heights of all the elements
      const containerHeight = containerRef.current.getBoundingClientRect().height;
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      const hr1Height = hr1Ref.current.getBoundingClientRect().height;
      const subheaderHeight = subheaderRef.current.getBoundingClientRect().height;
      const hr2Height = hr2Ref.current.getBoundingClientRect().height;

      // Calculate the remaining height
      const remainingHeight = containerHeight - (headerHeight + hr1Height + subheaderHeight + hr2Height);
      setScrollableHeight(remainingHeight);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen pl-[40px] gap-[35px] bg-[#f1f3f7]">
      <div className="flex flex-grow flex-col h-[100%] mt-[10px] gap-[20px]">
        <div className="flex justify-between items-center pl-[20px] pr-[20px] shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px] bg-[#fff]">
          <div className="flex h-[45px] items-center gap-[30px]">
            <button className="sportTitle">NFL</button><button className="sportTitle">NBA</button><button className="sportTitle">MLB</button><button className="sportTitle">NHL</button>
          </div>

          <div className="flex gap-[30px]">
            <button ref={accountButtonRef} className="h-[25px] bg-white" onClick={handleAccountClick}>Account</button>
            <button ref={signoutButtonRef} className="h-[25px] bg-white" aria-label="Sign out" onClick={handleSignoutClick}> Sign out</button>
          </div>
        </div>
        <div ref={containerRef} className="flex flex-grow flex-col rounded-[5px] shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px] bg-[#fff]">
          <div ref={headerRef} className="pl-[20px] pr-[20px] pt-[10px] pb-[10px] text-[20px] font-semibold">NFL Odds</div>
          <hr ref={hr1Ref}></hr>
          <div ref={subheaderRef} className="flex justify-between pl-[20px] pr-[20px] pt-[10px] pb-[10px] bg-[#f1f3f7]">
            <div className="w-[75px]">NFL</div>
            <div className="flex justify-around w-[725px]">
              <div className="text-[#788490]">MONEY</div>
              <div className="text-[#788490]">SPREAD</div>
              <div className="text-[#788490]">TOTAL</div>
            </div>
          </div>
          <hr ref={hr2Ref}></hr>
          <div style={{ height: `${scrollableHeight}px` }} className="overflow-auto pl-[20px] pr-[20px] pt-[10px] pb-[10px] hide-scrollbar">
            {createGameFromJson(setBetItems, betItems, increment, decrement, betObjects, setBetObjects, updateTotalOdds, placeBetButtonRef, userInputRef, buttonContentRef, otherButtonContentRef)}
          </div>
        </div>
      </div>

      <div className="flex flex-col min-w-[425px] w-[475px] h-[100%] shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
        <div className="flex justify-between border-b-2 border-b-solid border-b-[#c8c8c8] p-[15px] bg-[#fff] mb-[15px]">
          <div className="flex items-center">  
            <div ref={slipCountRef} className="w-[30px] h-[30px] bg-blue-500 text-white flex items-center justify-center rounded-full">{count}</div>
            <p className="flex align-center font-semibold">Betslip</p>
          </div>
          <div className="flex items-center">
            Balance
          </div>
        </div>

        <div ref={betSlipRef} className="overflow-auto h-[635px] border-t-2 border-b border-solid border-[#c8c8c8] pl-[20px] pr-[20px] bg-[#fff]">
          {betItems}
        </div>
        <div className="bg-[#fff] p-[15px] border-b-2 border-solid border-[#c8c8c8]">
          <div className="text-[20px] font-medium">
            {totalOdds}
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col justify-center border border-solid border-[#788490] rounded-[5px] w-[200px] h-[70px] pl-[10px] ">
              <label htmlFor="wager" className="text-[14px]">WAGER</label>
              <div className="flex items-center gap-[3px]">
                <div className="text-[20px]">$</div>
                <input ref={userInputRef} type="text" id="wager" name="wager" className="text-[20px] w-[150px] h-[20px] focus:outline-none" onInput={handleUserInput}/>
              </div>
            </div>
      
            <img src="./fist.png" alt="fist" className="h-[70px] w-auto"/>

            <div className="flex flex-col justify-center border border-solid border-[#788490] rounded-[5px] w-[200px] h-[70px] pl-[10px]">
              <label htmlFor="toWin" className="text-[14px]">TO WIN</label>
              <div className="flex items-center">
                <div>$</div>
                <input ref={toWinRef} type="text" id="toWin" name="toWin" className="text-[20px] w-[150px] h-[20px] focus:outline-none" readOnly/>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          <button ref={placeBetButtonRef} className="h-[100%] w-[100%] bg-[#bf1216]" onClick={handlePlaceBet}>
            <div ref={buttonContentRef} className="text-[#fff]">so are you gonna place a bet or nah??</div>
            <div ref={otherButtonContentRef} className="hidden"> <span className="text-[23px] font-light">Place ${userAmount} bet</span> <span className="font-light">TO WIN: ${profit}</span></div>
          </button>
        </div>
      </div>
  </main>
  )
}