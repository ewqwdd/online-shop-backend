const jwt = require("jsonwebtoken")
const config = require('../config.js')

module.exports = function(req, res, next){
    if(req.method === 'OPTIONS'){
        next()
    }

    try{
      
        const token = req.headers.authorization.split(' ')[1]
    
        const decoded = jwt.verify(token, config.jwtSecret)
        req.user = decoded.user
        

        next()
        return
    }
    catch(err){
        req.user = {role: "user"}
        next()
    }
}