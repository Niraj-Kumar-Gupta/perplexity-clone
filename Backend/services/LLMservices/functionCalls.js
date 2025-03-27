const { fetchContent } = require('./scrapingUtils');
const { realtimeWebSearch } = require('../realtimeWebSearch');

const FunctionsCalls = async(call,res) => {  
    const queryForAPI = call.args.query; 
    switch(call.name)
          {
   
            case "currentDateAndTime":{
               const date = new Date();
               const responseMessage = [{
                   functionResponse: {
                   name: 'currentDateAndTime',
                   response: {
                       currentDateAndTime: date.toLocaleString(),
                   }
                   }
                }];
                return responseMessage;
              }
   
            case "externalwebAPI":
               { 
                 const apiResponse = await realtimeWebSearch(queryForAPI);
                 console.log(apiResponse)
                 // const apires = {}
                 res.write(`data: ${JSON.stringify({ search:apiResponse })}\n\n`);
                  const webscrapInfo1 =  await fetchContent(apiResponse.results[0]?.url );
                  // const webscrapInfo2 =  await fetchContent(apiResponse.results[1]?.url );
              
                 
                 const responseMessage = [{
                   functionResponse: {
                     name: 'externalwebAPI',
                     response: {
                         seachResponse: apiResponse,
                         webscrapInfo1: webscrapInfo1,
                        //  webscrapInfo2: webscrapInfo2,
                     }
                    }
                  }];
   
                return responseMessage;
              }
   
              case "webScrapUsingURL":
                {  const url = call.args.url;
                   const webscrapInfo =  await fetchContent(url);
                   const responseMessage = [{
                     functionResponse: {
                       name: 'webScrapUsingURL',
                       response: {
                           webscrapInfo: webscrapInfo,
                       }
                     }
                   }];
                   return responseMessage;
                }
   
              default:{
                console.log("Unsupported function call:", call.name);
                return [];
              } 
   
    }}
   
 module.exports = {FunctionsCalls};   