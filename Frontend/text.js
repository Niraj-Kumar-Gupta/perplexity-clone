// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: });

// async function main() {
//   const completion = await groq.chat.completions
//     .create({
//       messages: [
//         {
//           role: "user",
//           content: "Explain the importance of fast language models",
//         },
//       ],
//       model: "gemma2-9b-it",
//     })
//   console.log(completion.choices[0].message.content);
// }

// main();



import ai from 'unlimited-ai';

(async () => {
  const model = 'gpt-4-turbo-2024-04-09';
  let messages = [
    { role: 'system', content: 'Great to meet you. What would you like to know?' }
  ];


  async function askQuestion(question) {
    messages.push({ role: 'user', content: question }); 
    const response = await ai.generate(model, messages);

    messages.push({ role: 'assistant', content: response }); 

 
    // console.log("User: " + question);
    console.log("AI: " + response);
  }

  // Example questions
  await askQuestion("write a code for recurssion in c++??");

})();
