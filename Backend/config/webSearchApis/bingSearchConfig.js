const axios = require('axios');

const BING_SEARCH_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';
const BING_API_KEY = process.env.BING_SEARCH_API_KEY;

async function fetchBingResults(query, options = {}) {
  if (!query || query.trim() === '') {
    throw new Error("Search query cannot be empty.");
  }

  const defaultParams = {
    q: query,
    count: options.count || 10,       
    offset: options.offset || 0,     
    mkt: options.market || 'en-US', 
  };

  try {
    console.log(`Fetching Bing results for: "${query}"`);

    const response = await axios.get(BING_SEARCH_ENDPOINT, {
      params: defaultParams,
      headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY },
    });
   
    
    if (response.data.webPages && response.data.webPages.value) {
      return response.data.webPages.value.map(result => ({
        title: result.name,
        url: result.url,
        snippet: result.snippet,
      }));
    } else {
      console.log("No search results found.");
      return [];
    }
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Rate limit exceeded. Retrying in 1 second...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchBingResults(query, options); 
    }

    console.error("Error fetching Bing results:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return [];
  }
}

module.exports = { fetchBingResults };
