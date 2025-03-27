const {
    getGoogleAuthUrl,
    getGoogleUserTokens,
    verifyIdToken,
    generateJwtToken,
  } = require('../services/googleAuthService');

const axios = require('axios');
const {User} = require('../models/User');

  const googleAuth = async (req,res)=>{

        const  access_Token  = req.headers.authorization;

        const accessToken =  access_Token.split(' ')[1];
       
        try{

            const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
            })

            const { name , email ,email_verified } = response.data;
            let user =  await User.findOne({ email });
            if(!user){
                const newUser = new User({
                       name,
                       email,
                       emailVerified: email_verified,
                   }); 
                  await newUser.save();
                  user = newUser;
               }
             
           const token =  generateJwtToken({user:user._id , email:user.email});
           return res.status(200).json({success:true,message: 'Authentication successful',token});
        }
        catch(error){
              console.log("getting error while fethcing",error)
              res.status(500).json({ message: 'Failed to save code' });
        }
  }
 

// const googleAuth = (req,res)=>{
//     const authUrl = getGoogleAuthUrl();
//     res.redirect(authUrl);
// }

// const googleAuthCallback = async (req, res)=>{
//     const code = req.query.code;
    
//     try {
//         const tokens = await getGoogleUserTokens(code);
//         const payload = await verifyIdToken(tokens.id_token);
    
//         const user = {
//           googleId: payload.sub,
//           name: payload.name,
//           email: payload.email,
//           picture: payload.picture,
//         };
        
       
//         // console.log(user);
        
//         const jwtToken = generateJwtToken(user);
//         res.redirect(`http://localhost:5173/login?token=${jwtToken}`);
//      } 
//      catch (error) {
//         console.error(error);
//         res.status(500).send('Authentication failed');
//   }

// }

module.exports = { googleAuth };