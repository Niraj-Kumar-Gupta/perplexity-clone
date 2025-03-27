const { getModel } = require('../../config/googleAIConfig');

const {FunctionsCalls} = require('./functionCalls');
const { externalwebAPI, getCurrentDateAndTime, webScrapUsingURL } = require('../../config/llmToolConfig');

let chatInstance;

async function initializeChat(userId) {
    try {
        const model = await getModel();
        chatInstance = await model.startChat({
            history: [],
            //     { role: "user", parts: [{ text: "Hello" }] },
            //     { role: "model", parts: [{ text: "You're an expert AI, kindly use emoji's while answering to user." }] },
    
            tools: {
                functionDeclarations: [externalwebAPI, getCurrentDateAndTime, webScrapUsingURL],
            },
        });
      return chatInstance;
    } catch (error) {
        console.error("Error initializing chat:", error.message);
        throw new Error("Chat initialization failed.");
    }
}
 
  async function sendMessageWithSearch(query,res) {
     if (!chatInstance) {
         throw new Error("Chat not initialized. Call initializeChat() first.");
     }
     try {
        
            const strictQuery = `
            ${query}
            (Important: If this query requires external or recent information, **you must use** the provided tools instead of answering directly.use "externalwebAPI" tool as your default_api. Do not say that you don't have access. Just call the correct tool.)
          `;

            const result = await chatInstance.sendMessage(strictQuery, {
                tools: {
                    functionDeclarations: [externalwebAPI, getCurrentDateAndTime, webScrapUsingURL],
                },
            });
    
         const functionCalls = await result.response.functionCalls(); 
        
         if (functionCalls && functionCalls?.length > 0) {
           res.write(`data: ${JSON.stringify({ search: "searching on Web" })}\n\n`);
  
                 const call = functionCalls[0];
                 
                 if (call) {
                  const responseMessage = await FunctionsCalls(call, res);

                  const formattedResponseMessage = JSON.stringify(responseMessage, null, 2);
                  
                  const functionCallResponse = `
                  Here is the latest web search information that you requested, provided in responseMessage.  
                  Analyze the details carefully and generate a well-structured, informative, and crisp response.  
                  
                  **Instructions:**  
                  - Summarize the key insights from the provided information.  
                  - Ensure your response is **concise yet comprehensive**.  
                  - **Prioritize accuracy and relevance** while explaining.  
                  - Structure the response logically for better readability.  
                  - If applicable, provide actionable insights or a step-by-step breakdown.  
                  
                  **Web Search Results:**  
                  \`\`\`json
                  ${formattedResponseMessage}
                  \`\`\`
                  
                  Now, based on this latest information, generate a detailed and well-explained answer.
                  Note:
                  - Be sure to use proper grammar, punctuation, and capitalization.
                  - Be sure to use appropriate emojis and symbols to convey information.
                  - Be sure to use appropriate terminology and phrases to convey information.
                  `;
                  
                  let finalResponse = await chatInstance.sendMessageStream(functionCallResponse);
                  
                  return finalResponse;
                    
                 } 
         }
 
      return result.response.text(); 
     } catch (error) {
         console.error("Error sending message:", error.message);
         return "There was an error processing your request. Please try again later.";
     }
 }

async function sendMessage(userId,query) {
   await initializeChat()
    if (!chatInstance) {
        throw new Error("Chat instance not initialized. Call initializeChat() first.");
    }
    try {
    
        const response = await chatInstance.sendMessageStream(query);

        // Save assistant response
        chat.messages.push({ role: 'assistant', content: response });
        await chat.save();

        return response;
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
         return "An error occurred while processing your request.";
    }
}


module.exports = { initializeChat, sendMessage, sendMessageWithSearch };
