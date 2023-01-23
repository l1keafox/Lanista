
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const {getTraining} = require('./../engine/game/trainingEffects');
const {getStructureEffect} = require('./../engine/game/structureIndex');
const {getItemEffect} = require('./../engine/game/itemsIndex');
const {getStoreItems} = require('./../engine/game/storeIndex');
const { getAbilityEffect } = require('./../engine/game/abilityIndex');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/owner/structures', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    res.send(owner2.structures)
})

router.post('/owner/structuresData', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });

    let rtnData = owner2.structures.map( struct =>{
        let rtn = getStructureEffect(struct);
        rtn.structure = struct;
        return rtn;
    }  );
    
    res.send(rtnData);

})

router.post('/owner/removeItems', async(req, res) => {
    // So how we want to do this: is return an object that is organized by slot.
    let owner = await Owner.findOne({ userAcct: req.body.id });
    req.body.remove.forEach(item =>{
        let found = owner.inventory.find( ele => ele.type == item.newEquip );
        if(found) found.amount -= 1;
    });

    // This will go through and clear out 0 and undefined items.
    owner.inventory = owner.inventory.map(item=>{
        if(item.amount){
            return item;
        }
    }).filter( ele => {
        return ele !== undefined
    })


    owner.markModified('inventory');
    await owner.save();
    res.send(owner);
})

router.post('/owner/itemsSort', async(req, res) => {
    // So how we want to do this: is return an object that is organized by slot.
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = {};
    owner.inventory.forEach( item =>{
        if(item.amount){
            let itemEffect = getItemEffect(item.type);
            if(!rtn[itemEffect.slot])  rtn[itemEffect.slot] = [];
            rtn[itemEffect.slot].push({type:item.type,number:item.amount } );
        }
    });

    res.send(rtn);
})

router.post('/owner/inventoryData', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    await owner.getTraining();

    let rtnData = owner.inventory.map( item =>{
        let rtn = getItemEffect(item.type);
        rtn.item = item.type;
        rtn.amount = item.amount;
        return rtn;
    }  );
    res.send(rtnData);
})
router.post('/owner/training', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = await owner.getTraining();
    res.send(rtn);
})
router.post('/owner/learning', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = await owner.getLearning();
    res.send(rtn);
})

router.post('/owner/trainingData', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    await owner.getTraining();

    let rtnData = owner.training.map( train =>{
        let rtn = getTraining(train);
        if(rtn){
            rtn.training = train;
            return rtn;
        }else {
            console.log("trainfailure?",train);
        }
    }  ) .filter((notUndefined) => notUndefined !== undefined);
    res.send(rtnData);
})
router.post('/owner/learningData', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    await owner.getLearning();
  
    let rtnData = owner.learning.map( skill =>{
        let rtn = getAbilityEffect(skill);
        if(rtn){
            rtn.learning = skill;
            return rtn;
        } else {
            console.log('leanring data?',skill);
        }
    }  );
    res.send(rtnData);
})

router.post('/owner/store', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    let storeItems = getStoreItems();

    let rtn = {};
    for(let type in storeItems){
        rtn[type] = storeItems[type].map( ele =>{
            if(type === "items"){
                // Here we need to check if items against fame.
                let item = getItemEffect(ele.type);
                if(owner2.fame >= ele.fame){
                item.type = ele.type;
                item.cost = ele.cost;
                return item;
                }
            } else if(type ==="structures"){
                // Here we need to check if structure doesn't already exist.
                let struct = getStructureEffect(ele.type)
                if(!struct){
                    console.log("  -Missing>",ele.type, "structure not available, need to be created");
                } else 
                if( owner2.fame >= ele.fame && owner2.structures.indexOf(ele.type) < 0){
                    struct.type = ele.type;
                    struct.cost = ele.cost;
                    return struct;
                }
            }
        
        }).filter(notUndefined => notUndefined !== undefined);
    }
    res.send(rtn)
})

router.post('/owner/buyItem', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    
    if(owner.gold < req.body.buyThisThing.cost){
        res.send(false);    
    }
    owner.gold-=req.body.buyThisThing.cost;

        if(req.body.buyThisThing.item){
            const exist = owner.inventory.find( ele => ele.type ==req.body.buyThisThing.item);

            if(exist){
                exist.amount++;
            } else {
                owner.inventory.push({type:req.body.buyThisThing.item,amount:1});
            }
        } else if(req.body.buyThisThing.structure){
            owner.structures.push(req.body.buyThisThing.structure);
        }
    owner.markModified('inventory');
    owner.save();
    res.send(true);
})



// router.post('/owner', async(req, res) => {
//     let owner2 = await Owner.findOne({ userAcct: req.body.id }).populate('gladiators');
//     res.send(owner2)
// })
router.post('/owner', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id }).populate('gladiators',['name','age','winRecord','lossRecord','weekWin','monthWin','quarterWin','yearWin']);
    res.send(owner2)
})


module.exports = router