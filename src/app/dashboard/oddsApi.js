import React, { useState, useRef, useEffect } from "react";
const axios = require('axios').default;

const API_KEY = '8fd2ed4f6be3ad728dcecf74df0eeda3';

export async function getNFLGames() {
  const url = 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/';
  const params = {
      apiKey: API_KEY, // Your Odds API key
      regions: 'us', // United States region
      markets: 'spreads,h2h,totals', // Moneyline and point spreads
      bookmakers: 'fanduel', // Filter for FanDuel
  };

  try {
      const response = await axios.get(url, { params: params });
      console.log(JSON.stringify(response.data));
      const requestsRemaining = response.headers['x-requests-remaining'];
      console.log(`Requests Remaining: ${requestsRemaining}`);

      return response.data; // Return the array of NFL games
  } catch (error) {
      console.error('Error fetching odds:', error.response ? error.response.data : error.message);
      throw error; // Re-throw the error to handle it in the calling code
  }
}

export function convertDecimalToAmerican(decimalOdds) {
  if (decimalOdds >= 2) {
    return Math.round((decimalOdds - 1) * 100);
  } else {
    return Math.round(-100 / (decimalOdds - 1));
  }
}

export function createGame() {
  const [games, setGames] = useState([]);
  const betButton = useRef(null);

  const handleBetButton = (market) => (e) => {
    e.preventDefault();
    console.log(market)
  }

  useEffect(() => {
    getNFLGames().then((fetchedGames) => {
      if (fetchedGames) {
        const formattedGames = fetchedGames.slice(0, 14).map((game, index) => {
          const homeTeam = game.home_team;
          const awayTeam = game.away_team;
          const formattedHomeTeam = game.home_team.toLowerCase().replace(/ /g, "_");
          const formattedAwayTeam = game.away_team.toLowerCase().replace(/ /g, "_");
          const homeTeamLink = `/${formattedHomeTeam}.png`;
          const awayTeamLink = `/${formattedAwayTeam}.png`;
          const sameGameParlayLink = 'SGP.png';
  
          const markets = game.bookmakers[0]?.markets || [];
  
          // Extract outcomes for each market
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
      } else {
        console.log("No games found.");
      }
    });
  }, []); // Add the empty dependency array here

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
                        <button ref={betButton} className="w-[235px] border border-solid border-[blue]" onClick={handleBetButton(market)}>
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

