const { bingSearchConfig } = require('../config/webSearchApis/bingSearchConfig');
const { langChainSearchAPI } = require('../config/webSearchApis/langChainSearchAPI');
const { tavleySeachConfig } = require('../config/webSearchApis/tavleySeachConfig');

const realtimeWebSearch = async (query) => {
    try {
        const bingRes = await bingSearchConfig(query);
        if (bingRes) {
            return bingRes; 
        }
    } catch (error) {
        console.error("Bing search failed:", error.message);
    }

  

    try {
 
        const tavleyRes = await tavleySeachConfig(query);
        if (tavleyRes) {
            return tavleyRes; 
        }
    } catch (error) {
        console.error("Tavley search failed:", error.message);
    }
    
    try {
        const langChainRes = await langChainSearchAPI(query);
        if (langChainRes) {
            return langChainRes; 
        }
    } catch (error) {
        console.error("LangChain search failed:", error.message);
    }

    throw new Error("All search APIs failed to return a result.");
   
};

module.exports = { realtimeWebSearch };
