const jwt = require('jsonwebtoken');
const { client, GOOGLE_CLIENT_ID } = require('../config/googleAuthConfig');
const JWT_SECRET = process.env.JWT_SECRET;

const getGoogleAuthUrl = () => {
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
  };

  const getGoogleUserTokens = async (code) => {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    return tokens;
  };
  
  const verifyIdToken = async (idToken) => {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  };
  
  const generateJwtToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  };

 

  module.exports = {
    getGoogleAuthUrl,
    getGoogleUserTokens,
    verifyIdToken,
    generateJwtToken,
  };  