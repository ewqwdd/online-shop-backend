const User = require('../models/userModel');
const brcypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config.js')
const Basket = require('../models/basketModel.js');


const generateWebToken = (payload)=>{
    return jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '24h' });
}

class authController{

    async register(req, res){
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }
        const {username, email, password} = req.body;

        try{
            const candidate = await User.findOne({username})
            if(candidate){
                return res.status(400).json("User with this ID already exists")
            }
            const hashedPassword = brcypt.hashSync(password, 7)
            const user = new User({
                username,
                email,
                password:hashedPassword
            })
            let saved = await user.save()
            let basket = new Basket({
                user_id: saved._id,
                items:[]
            })
            await basket.save()
            const payload = {
                user: {
                  username: username,
                  role: saved.role,
                  id: saved._id
                }
              };
          
            const token = generateWebToken(payload)
            res.json({username, password, token, role: saved.role})
            
        }
        catch(err){
            res.status(500).json({message: err})
        }
    }

    async login(req, res){
        const {username, password} = req.body;
        try{
            const candidate = await User.findOne({username})
            if(!candidate){
                return res.status(400).json("No user with that username")
            }
            const validPassword = brcypt.compareSync(password, candidate.password)
            if(!validPassword){
                return res.status(400).json("incorrect password")
            }
            const payload = {
                user: {
                  username: candidate.username,
                  role: candidate.role,
                  id: candidate._id
                }
              };
          
            const token = generateWebToken(payload)
            res.json({username, password, token, role: candidate.role})
            
        }
        catch(err){
            res.status(500).json({message: err})
        }
    }

    async check(req, res){
        let token = req.headers.authorization.split(' ')[1]
        return res.json({token, username: req.user.username, role: req.user.role})
    }

    async checkAdmin(req, res){
        let token = req.headers.authorization.split(' ')[1]
        return res.json({token, username: req.user.username, role: req.user.role})
    }
}

module.exports = authController;