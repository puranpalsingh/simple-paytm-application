const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
 
async function jwtMiddlwares(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(500).json({
            msg : "authorisation in correct"
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwtdecoded = jwt.verify(token, JWT_SECRET);
        console.log("jwtdecoded");
        req.userId = jwtdecoded.userId;
        console.log('next');
        next();
    }
    catch(err) {
        return res.status(400).json({
            msg : "jwt verify unsucessfully"
        });
    }
}

module.exports = jwtMiddlwares;