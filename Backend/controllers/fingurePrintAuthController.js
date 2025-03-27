
const {
    findUserByEmail,
    addFingerprint,
    getFingerprints,
    updateFingerprintCounter,
} = require('../models/db');
const jwt = require('jsonwebtoken');
const { generateRegistrationOptions, 
    verifyRegistrationResponse, 
    generateAuthenticationOptions, 
    verifyAuthenticationResponse } = require("@simplewebauthn/server");

const RP_ID = process.env.RP_ID || "localhost";
const origin = process.env.CLIENT_URL ;


const registerOptions = async(req,res)=>{
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ error: "User does not exist, please sign up first" });
    }
 
    if (user.fingerprints.length !== 0) {
        return res.status(400).json({ error: "Fingerprint already exists" });
    }
   
    const options = await generateRegistrationOptions({
      rpID: RP_ID,
      rpName: "Web Dev Simplified",
      userName: email,
      attestationType: 'none',
    authenticatorSelection: { authenticatorAttachment: 'platform' },
    })
   

       res.cookie(
      "regInfo",
      JSON.stringify({
        userID: options.user.id,
        email,
        challenge: options.challenge,
      }),
      { httpOnly: true, maxAge: 60000, secure: process.env.NODE_ENV === "production" }
    )
    
   
    res.json(options)

} 



const registerVerify = async(req,res)=>{
    const regInfo = JSON.parse(req.cookies.regInfo)
    
   try{
    if (!regInfo) {
      return res.status(400).json({ error: "Registration info not found" })
    }
  
    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: regInfo.challenge,
      expectedOrigin: origin,
      expectedRPID: RP_ID,
    })
  
    

    if (verification.verified) {

       const { registrationInfo } = verification;
       const { credential, credentialDeviceType, credentialBackedUp} = registrationInfo;
       const email = regInfo.email;

        const passKey = {
          email,
          webAuthnUserID: regInfo.userID,
          id:credential.id,
          publicKey:credential.publicKey.join(','),
          counter: credential.counter,
          transports: credential.transports,
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
        }

        await addFingerprint(email, passKey);

    
        res.clearCookie("regInfo")
        return res.json({ verified: verification.verified })
      } else {
        return res
          .status(400)
          .json({ verified: false, error: "Verification failed" })
      }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(400).send({ error: error.message });
      }
}



const authenticateOptions = async (req,res) => {
    
    const email = req.query.email
   
    if (!email) {  return res.status(400).json({ error: "Email is required" }) }


     try{
            const user = await findUserByEmail(email);
            if (user === null) {
                return res.status(400).json({ error: "No user for this email" })
            }
            if (user.fingerprints.length === 0) {
                return res.status(400).json({ error: "No fingerprints found for this email" });
            }

            const userPasskeys =  user.fingerprints ;

            const options = await generateAuthenticationOptions({
                rpID: RP_ID,
                allowCredentials: userPasskeys.map(passkey => ({
                    id: passkey.id,
                    transports: passkey.transports,
                }))
            })

          res.cookie(
            "authInfo",
            JSON.stringify({
            userId: user.id,
            email: user.email,
            challenge: options.challenge,
            }),
            { httpOnly: true, maxAge: 60000, secure: process.env.NODE_ENV === "production" }
        )

       res.json(options)

   }
  catch (err) {
            console.error(err);
            res.status(500).send("Server error.");
        }
}


const authenticateVerify = async (req, res) => {
    try {
      const authInfo = JSON.parse(req.cookies.authInfo);
      if (!authInfo) {
                return res.status(400).json({ error: "Authentication info not found" });
         }

      const { body } = req;
      const fingerprints = await getFingerprints(authInfo.email);
      const passkey = fingerprints.find(fp => fp.id === req.body.id);
      if (!passkey) {
        return res.status(400).json({ error: "Fingerprint not registered" });  }


      const verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge: authInfo.challenge,
        expectedOrigin: origin,
        expectedRPID: RP_ID,
        credential: {
          id: passkey.id,
          publicKey: new Uint8Array(passkey.publicKey.split(',').map(Number)),
          counter: passkey.counter,
          transports: passkey.transports,
        },
      });
  
      const { verified } = verification;
     
      if (verified) {
        const { authenticationInfo } = verification;
        const { newCounter } = authenticationInfo;
        await updateFingerprintCounter(authInfo.email, passkey.id, newCounter);
        res.clearCookie("authInfo");
        
        const user = await findUserByEmail(authInfo.email);

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
             process.env.JWT_SECRET,
             { expiresIn:'1h'},
         )

        return res.json({ verified: true , message: 'Login successful', token });
      } else {
        return res.status(400).json({ verified: false, error: "Verification failed" });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return res.status(400).send({ error: error.message });
    }
  };
  

module.exports = { registerOptions, registerVerify, authenticateOptions, authenticateVerify };







