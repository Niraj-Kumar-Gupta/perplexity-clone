const { DuckDuckGoSearch } = require('@langchain/community/tools/duckduckgo_search');

const langChainSearchAPI = async (queryForAPI) => {
    console.log('Creating DuckDuckGoSearch tool...');
    const tool = new DuckDuckGoSearch({ maxResults: 4 });

    console.log('Invoking tool with query:',queryForAPI);
    try {
        const result = await tool.invoke(queryForAPI);
        // console.log('Result:', result);
        //title,link,snippet
       return result;
    } catch (error) {
        console.error('Error invoking DuckDuckGoSearch:', error);
        throw error;
    }
}

module.exports = { langChainSearchAPI };
