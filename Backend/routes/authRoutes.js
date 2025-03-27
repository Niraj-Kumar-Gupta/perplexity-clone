const express = require('express');

const router = express.Router();

const {  registerOptions, registerVerify ,authenticateOptions, authenticateVerify} = require('../controllers/fingurePrintAuthController');

router.get('/register-options',registerOptions);
router.post('/register-verify',registerVerify);
router.get('/authenticate-options',authenticateOptions);
router.post('/authenticate-verify',authenticateVerify);
 
module.exports = router;