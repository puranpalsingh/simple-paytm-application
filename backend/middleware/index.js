const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config");
 
async function jwtMiddlwares(req, res, next) {
    const authorization = req.authorization;
    if(!authorization || !authorization.startsWith('Bearer ')) {
        res.status(500).json({
            msg : "authorisation in correct"
        });
    }
    const token = authorization.split(' ');
    const jwttoken = token[1];
    try {
        const jwtdecoded = jwt.verify(jwttoken, JWT_SECRET);
        req.userId = jwtdecoded.userId;
        next();
    }
    catch(err) {
        return res.status(400).json({
            msg : "jwt verify unsucessfully"
        });
    }
}

module.exports = jwtMiddlwares;