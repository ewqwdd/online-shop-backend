const User = require('../models/userModel');
const Basket = require('../models/basketModel.js');
const brcypt = require('bcryptjs')


class userController{
    async postUser(req, res){
        try{
            const { username, email, password, role } = req.body;
        const hashedPassword = brcypt.hashSync(password, 7)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
          });
        const saved = await newUser.save()
        let basket = new Basket({
            user_id: saved._id,
            items:[]
        })
        await basket.save()
        res.json(saved)
        }
        catch(err){
            res.status(400).json({error: err.message})
        }
    }

    async getUser(req, res){
        try{
            const { id } = req.params;
        
        const user = await User.findById(id)
        res.json(user)
        }
        catch(error){
            res.status(404).json({ error: error.message });
        }
    }

    async deleteUser(req, res){
        try{
            const { id } = req.params;
            let user = await User.findOneAndRemove({_id: id})
            if(!user){
                res.status(404).json({ message: 'User not found' });
            }
            res.json(user)
        }
        catch(error){
            res.status(404).json({ error: error.message });
        }
    }

    async getUsers(req, res){
        try{
            let {role} = req.user
        const user = await User.find()
        if(role==='admin'){
            return res.json(user)
        }

        let users = [];
        user.forEach((elem)=>{
            users.push({_id: elem._id, username: elem.username})
        })
        
        return res.json(users)

        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    async addAdmin(req, res){
        try{
            const { username, email, password } = req.body;
        const hashedPassword = brcypt.hashSync(password, 7)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
          });
        const saved = await newUser.save()
        let basket = new Basket({
            user_id: saved._id,
            items:[]
        })
        await basket.save()
        res.json(saved)
        }
        catch(err){
            res.status(400)
        }
    }

    async updateUser(req, res){
        try{
            const {id} = req.params
            const {username, email, role} = req.body
            let updatedData = {
                username, email, role
            }
            const saved = await User.findOneAndUpdate({_id: id}, {$set: updatedData}, {new: true})
            return res.json(saved)
        }
        catch(err){
            res.status(500).json({error: err.message})
        }

    }

    async ifBoughtItem(req, res){
        try{
            const {id} = req.params
            const {username} = req.user

            let user = await User.findOne({username})

            if(!user){
                return res.status(500).json({error: "user doesn't exists"})
            }

            let items = user.boughtItems

            let index = items.findIndex((elem)=>String(elem.item)==id)

            if(index==-1){
                return res.json(false)
            }
            else{
                return res.json(true)
            }
        }
        catch(err){
            res.status(500).json({error: err.message})
        }
    }
}

module.exports = userController;