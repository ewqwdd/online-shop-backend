const Basket = require('../models/basketModel.js');
const User = require('../models/userModel.js')

class basketController{
    async addItem(req, res){
        const { item_id } = req.body;
        let username = req.user.username
        try{          
            let basket = await Basket.findOne({username})
            if(basket){
                let items = [...basket.items]
                const indexToUpdate = items.findIndex(elem => elem.item == item_id);
                if(indexToUpdate===-1){
                    const added = [...basket.items, {item: item_id, amount:1}]
                    const saved = await Basket.findOneAndUpdate({username}, {$set: {items: added}})
                    let updated = await Basket.findOne({username})
                    return res.json(updated)
                }
                else{
                    items[indexToUpdate].amount+=1
                    const saved = await Basket.findOneAndUpdate({username}, {$set: {items: items}})
                    let updated = await Basket.findOne({username})
                    return res.json(updated)
                }
            }
            else{
                basket = new Basket({
                    username, items:[{item: item_id, amount:1}]
                });
                const saved = await basket.save()
                return res.json(saved)
            }
            
            }
        catch(err){
            res.status(500)
        }
    }

    async getBasket(req, res){

        try{
            const { username } = req.params;
            if(req.user.username!==username && req.user.role!=='admin'){
                res.status(400).json({message:"Unauthorized access"})
            }
        let basket = await Basket.findOne({username})
        if(!basket){
            basket = new Basket({
                username, items:[]
            });
            let saved = await basket.save()
            return res.json(saved)
        }
        return res.json(basket)
        }
        catch(error){
            res.status(404).json({ error: error.message });
        }
    }

    async getBaskets(req, res){
        try{
        const basket = await Basket.find()
        res.json(basket)
        }
        catch(error){
            res.status(500).json({ error: error.message });
        }
    }

    async deleteItem(req, res){
        try{
            const { username, item_id } = req.body;
            if(req.user.username!==username || req.user.role!=='admin'){
                res.status(400).json({message: "Unauthorized access"})
            }
            let basket = await Basket.findOne({username})
            if(!basket){
                res.status(404).json({ message: 'Item not found' });
            }
            let modified = [...basket.items].filter(elem=>elem.item!=item_id)
            const saved = await Basket.findOneAndUpdate({username}, {$set: {items: modified}})
            let updated = await Basket.findOne({username})
            res.json(updated)
        }
        catch(error){
            res.status(404).json({ error: error.message });
        }
    }

    async decreaseItem(req, res){
        try{
            const { item_id } = req.body;
            const username = req.user.username;
            let basket = await Basket.findOne({username})
            if(!basket){
                return res.status(404).json({ message: 'Item not found' });
            }
            let items = [...basket.items]
            const indexToUpdate = items.findIndex(elem => elem.item == item_id);
            if(indexToUpdate==-1){
                return res.status(500).json({message:"incorrect id"})
            }
            items[indexToUpdate].amount-=1
            if(items[indexToUpdate].amount==0){
                items = items.filter(elem=>elem.item!=item_id)
            }
            const saved = await Basket.findOneAndUpdate({username}, {$set: {items: items}})
            let updated = await Basket.findOne({username})
            return res.json(updated)
        }
        catch(error){
            res.status(404).json({ error: error.message });
        }
    }

    async buyItems(req, res){
        try{
            const username = req.user.username
            let basket = await Basket.findOne({username})
            let items = basket.items
            let user = await User.findOne({username})
            let boughtItems = user.boughtItems
            items.forEach((elem)=>{
                
                let index = boughtItems.findIndex((element)=>String(elem.item)==String(element.item))
                if(index===-1){
                    boughtItems.push(elem)
                }
                else{
                    boughtItems[index].amount += elem.amount
                }
            })
            let saved = await User.findOneAndUpdate({username}, {$set: {boughtItems: boughtItems}})
            let updated = await Basket.findOneAndUpdate({username}, {$set: {items: []}})
            return res.json(updated)
        }   
        catch(err){
            res.status(500).json({error: err.message})
        }
    }

}

module.exports = basketController;