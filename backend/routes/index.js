const express = require('express');
const userRoute = require("./user");
const accountroute = require("./account");
const router = express.Router();

router.use('/user',userRoute);
router.use('/account', accountroute);


module.exports = router;

