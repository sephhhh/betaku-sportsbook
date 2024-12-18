const axios = require('axios');

const API_KEY = '616f6742356a0691a93db8e24f892867'; // Replace with your API key
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export const getNFLGames = async (bookmaker = 'fanduel', regions = 'us') => {
  try {
      const response = await axios.get(`${BASE_URL}/americanfootball_nfl/odds`, {
          params: {
              apiKey: API_KEY,
              regions,
              markets: 'spreads,totals,h2h',
              oddsFormat: 'decimal',
              dateFormat: 'iso',
              bookmakers: bookmaker,
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching NFL games:', error.response?.data || error.message);
  }
};

function decimalToAmericanOdds(decimalOdds) {
  if (decimalOdds < 2.0) {
      // Favorites: Use the formula for odds ≤ 2.0
      return Math.round(-100 / (decimalOdds - 1));
  } else {
      // Underdogs: Use the formula for odds > 2.0
      return Math.round((decimalOdds - 1) * 100);
  }
}


