const chatSession = require('./services/LLMservices/chatSession');
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {
    console.log(`--- Server is running on port ----  ${PORT}`);
     await chatSession.handleServerRestart();
});
