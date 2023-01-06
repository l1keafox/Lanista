
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const {getTraining} = require('./../engine/game/trainingEffects');
const {getStructureEffect} = require('./../engine/game/structureIndex');
const {getItemEffect} = require('./../engine/game/itemsIndex');
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

router.post('/owner/itemsSort', async(req, res) => {
    // So how we want to do this: is return an object that is organized by slot.
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = {};
    owner.inventory.forEach( item =>{
        let itemEffect = getItemEffect(item.type);
        if(!rtn[itemEffect.slot])  rtn[itemEffect.slot] = [];
        rtn[itemEffect.slot].push({type:item.type,number:item.amount } );
    });

    res.send(rtn);
})


router.post('/owner/training', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = await owner.getTraining();
    res.send(rtn);
})

router.post('/owner/trainingData', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    await owner.getTraining();

    let rtnData = owner.training.map( train =>{
        let rtn = getTraining(train);
        rtn.training = train;
        return rtn;
    }  );
    res.send(rtnData);
})

router.post('/owner', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    res.send(owner2)
})


module.exports = router