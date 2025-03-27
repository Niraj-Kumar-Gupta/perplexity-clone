const externalwebAPI = {
    name: 'externalwebAPI',
    description: 'An external web API for retrieving additional data like real-time information, analytics, and more. This function call returns an array containing objects with properties such as title, url, and snippet.',
    parameters: {
      type: 'object',
      description: 'Parameters required to retrieve real-time information from an external web source.',
      properties: {
        query: {
          type: 'string',
          description: 'A string representing the query to search for real-time information or analytics.',
        },
      },
      required: ['query'],
    },
  };
  
  
  const getCurrentDateAndTime = {
    name: 'currentDateAndTime',
    description: 'Returns the only current date and time.this is not used for real-time information.for real-time information you need to call externalwebAPI function to retrieve',
    parameters: {
      type: 'object',
      description: 'No parameters required.',
       properties: {
           query:{
             type:'string',
             description: 'A string representing the query to get the current date and time only.Note this is not used for real-time information',
             enum: ['get current date and time']
           }
        },
    
    },
  }


  const webScrapUsingURL = {
    name: 'webScrapUsingURL',
    description: 'Returns the contents of the specified URL by performing web scraping.',
    parameters: {
      type: 'object',
      description: 'An object containing the URL to scrape for real-time information.',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to scrape for real-time information.',
        },
      },
      required: ['url'],
    },
  };


  module.exports = { externalwebAPI, getCurrentDateAndTime, webScrapUsingURL };
  