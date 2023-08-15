const jwt = require("jsonwebtoken")
const config = require('../config.js')

module.exports = function(req, res, next){
    if(req.method === 'OPTIONS'){
        next()
    }

    try{
        const token = req.headers.authorization.split(' ')[1]
        
        if(!token){
            return res.status(401).json({message:"not authorized"})
        }
        const decoded = jwt.verify(token, config.jwtSecret)
        req.user = decoded.user
        
        if(req.user.role!='admin'){
            return res.status(400).json({message:"You are not permited to view this data"})
        }
        next()
    }
    catch(err){
        return res.status(500).json(err)
    }
}