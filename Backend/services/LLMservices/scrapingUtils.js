const axios = require('axios');
const cheerio = require('cheerio');

async function fetchContent(url) {
    try {
        if (!url) {
            throw new Error("URL is required.");
        }

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!data || data.trim() === '') {
            throw new Error("Empty or invalid response data.");
        }
       
        const $ = cheerio.load(data);

        const contentElements = $('div,p,h1,h2,h3,h4,select,textarea');
        if (contentElements.length === 0) {
            console.warn("No paragraph elements found.");
        }

        const contentArray = contentElements
            .map((_, element ) => {
                const text = $(element).text().trim();
                return text ? text : null;
            })
            .get();

        
        const content = contentArray.join('\n');

        console.log("Web scraped successfully:", url);
        return content; 
    } catch (error) {
        console.error(`Error fetching content from ${url}:`, error.message);
        return ''; 
    }
}

module.exports = { fetchContent };
