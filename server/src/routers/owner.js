
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const {getTraining} = require('./../engine/game/trainingEffects');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/owner/structures', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    console.log(owner2.structures);
    res.send(owner2.structures)
})

router.post('/owner/training', async(req, res) => {
    let trainingAvailable = await Owner.findOne({ userAcct: req.body.id });
    res.send(trainingAvailable.training)
})

router.post('/owner/trainingData', async(req, res) => {
    let trainingAvailable = await Owner.findOne({ userAcct: req.body.id });
    // This needs to return more than just an array of training, this needs to return description/bonuses/costs ect.ect.
    // trainingEffects 
    
    //console.log(getTraining(owner2.training[0]));
    let rtnData = trainingAvailable.map( train =>{
        return getTraining(train);
    }  );
    console.log(rtnData);
    res.send(rtnData);
})

router.post('/owner', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    res.send(owner2)
})


module.exports = router