const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: process.env.TAVLEY_SEARCH_API_KEY });


const tavleySeachConfig = async(query)=>{

    try{
        const response = await tvly.search(query,maxResults=4);
        console.log(response);
        return response;
    }
    catch(e){
        console.error(e.message);
       
    }

    try{
        const response = await tvly.searchQNA(query);
        console.log(response);
        return response;
    }
    catch(e){
        console.error(e.message);
    }

    try{
        const response = await tvly.searchContext(query,maxResults=4);
        console.log(response);
        return response;
    }
    catch(e){
        console.error(e.message);
       
    }
    throw new Error("All Tavley search APIs failed to return a result.");
}

module.exports = { tavleySeachConfig };



