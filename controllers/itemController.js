const Item = require('../models/itemModel.js');
const _ = require('lodash')
const config = require("../config.js")
const path = require('path')
const fs = require('fs');
const Basket = require('../models/basketModel.js');


const baseUrl = config.baseUrl


class itemController{
    async postItem(req, res){
        try{
            let files = req.files

            if(files && files.files){
                files = files.files
            }
            
            console.log(files)

            let { title, img, characteristics, description, price } = req.body;

            if(typeof img == "string"){
                img = JSON.parse(img)
            }
            if(!img){
                img=[]
            }
            const url = _.kebabCase(title)

            if(Array.isArray(files)){
                for(let key in files){
                    const filePath = baseUrl + url + '/' + files[key].name
                    img.push(filePath)
                    const fullPath = path.join(config.publicPath, url)
                    fs.mkdirSync(fullPath, {recursive: true})
                                    
                    files[key].mv(path.join(fullPath, files[key].name), (err)=>{
                        console.log(err)
                    })
                }
            }
            else if(files){
                const filePath = baseUrl + url + '/' + files.name
                img.push(filePath)
                const fullPath = path.join(config.publicPath, url)
                fs.mkdirSync(fullPath, {recursive: true})
                                
                files.mv(path.join(fullPath, files.name), (err)=>{
                    console.log(err)
                })
            }

            if(typeof characteristics == 'string'){
                characteristics = await JSON.parse(characteristics)
            }

        const newItem = new Item({
            title, img, characteristics, description, price: Number(price), url
          });
        const saved = await newItem.save()
        return res.json(saved)
        }
        catch(err){
            return res.status(500).json(err)
        }
    }

    async getItem(req, res){
        try{
            const { name } = req.params;
            let kebab = _.kebabCase(name)
        
        const item = await Item.findOne({url: kebab})
        return res.json(item)
        }
        catch(error){
            return res.status(404).json({ error: error.message });
        }
    }

    async deleteItem(req, res){
        try{
            const { id } = req.body;
            let item = await Item.findOneAndRemove({_id: id})
            if(!item){
                return res.status(404).json({ message: 'Item not found' });
            }

            let basketsWithItem = await Basket.find({items:{$elemMatch: {item: id}}})
            basketsWithItem.forEach(async(elem)=>{
                let updatedItems = elem.items.filter((itm)=>itm.item!=id)
                let saved = await Basket.findOneAndUpdate({_id:elem._id}, {$set: {items: updatedItems}}, {new: true})
            })

            return res.json(item)
        }
        catch(error){
            return res.status(404).json({ error: error.message });
        }
    }

    async getItems(req, res){

        let {limit=10, page=1, query="", priceFrom=0, priceTo=1000000} = req.query

        let item;

        try{
        let all = await Item.find()
        item = await Item.find({title:{$regex: new RegExp(query, "i")}, price:{$gt: priceFrom, $lt: priceTo}}).skip((page-1)*limit).limit(limit)
        
        let total = await Item.countDocuments()
        return res.json({items: item, total})
            
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    async getItemById(req, res){
        const {id} = req.params
        try{
        const item = await Item.findById(id)
        return res.json(item)
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    async updateItem(req, res){
        let files = req.files
        const {id} = req.params
        let { title, img, characteristics, description, price } = req.body;
        
        try{
            if(files && files.files){
                files = files.files
            }

            if(typeof img == "string"){
                img = await JSON.parse(img)
            }
            
            let initial = await Item.findById(id)
            let imagesToDelete = initial.img.filter(elem=>!img.includes(elem))
            imagesToDelete.forEach((elem)=>{
                if(!elem.includes(baseUrl)){
                    return
                }
                const remainingPath = elem.split(baseUrl)[1];
                console.log(path.join(config.publicPath, remainingPath))
                fs.unlink(path.join(config.publicPath, remainingPath), (err)=>{
                    console.log(err)
                })
            })

            let url = initial.url
            
            if(Array.isArray(files)){
                for(var key in files){
                    const filePath = baseUrl + url + '/' + files[key].name
                    img.push(filePath)
                    const fullPath = path.join(config.publicPath, url)
                    fs.mkdirSync(fullPath, {recursive: true})
                    files[key].mv(path.join(fullPath, files[key].name), (err)=>{
                        console.log(err)
                    })
                }
            }
            else if(files){
                const filePath = baseUrl + url + '/' + files.name
                img.push(filePath)
                const fullPath = path.join(config.publicPath, url)
                fs.mkdirSync(fullPath, {recursive: true})
                files.mv(path.join(fullPath, files.name), (err)=>{
                    console.log(err)
                })
            }
            

            if(typeof characteristics == 'string'){
                characteristics = await JSON.parse(characteristics)
            }
            
            let updatedData = {
                title, img, characteristics, description, price
            }

            if(title){
                const url = _.kebabCase(title)
                updatedData.url = url
            }

            const saved = await Item.findOneAndUpdate({_id: id}, {$set: updatedData}, {new: true})
            return res.json(saved)
        }
        catch(err){
            return res.status(500).json({error: err.message})
        }
    }

    async findItem(req, res){
        let {query} = req.params

        try{
            let saved = await Item.find({title: {$regex: query}})
            res.json(saved)
        }
        catch(err){
            return res.status(500).json({error: err.message})
        }
    }

    async addReview(req, res){

        try{
            let {id} = req.params
            let {text, value} = req.body
            let user_id = req.user.id

            let item = await Item.findById(id)

            let reviews = item.rating

            let index = reviews.findIndex((elem)=>elem.user_id==user_id)

            if(index===-1){
                reviews = [{user_id, text, value}, ...reviews]
                let saved = await Item.findOneAndUpdate({_id: id}, {$set: {rating: reviews}})
                return res.json(saved)
            }
            else{
                return res.status(500).json({error: "You already have a review for this item"})
            }
        }
        catch(err){
            return res.status(500).json({error: err.message})
        }
        
    }
}

module.exports = itemController;