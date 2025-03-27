require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { externalwebAPI, getCurrentDateAndTime, webScrapUsingURL } = require('./llmToolConfig');


async function getModel() {
  const model = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 2024,
        temperature: 0.7,
      },
      tools: {
        functionDeclarations: [externalwebAPI,getCurrentDateAndTime,webScrapUsingURL], 
        codeExecution: {},
      },
    });

  return model;
}


module.exports = { getModel}; 