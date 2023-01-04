
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
//const {createNewOwner,createNewGladiator} = require('./../engine/game/utils');
const router = express.Router();

const { getItemEffect } = require("./../engine/game/itemsIndex");
const { getAbilityEffect } = require("./../engine/game/abilityIndex");

router.post('/gladiator/', async(req, res) => {
    // View logged in user profile
    // let user = await User.findOne({ _id: req.body.id });
    // let owner = await Owner.findOne({ _id: user.owner });
    let gladiator = await Gladiator.findOne({ _id: req.body.id });
    console.log( getItemEffect(gladiator.mainHand).abilities[0] );
    let test = getAbilityEffect(getItemEffect(gladiator.mainHand).abilities[0]);
    console.log(test   );
    res.send(gladiator)
})
router.post('/gladiator/saveDay', async(req, res) => {
    // View logged in user profile
    // let user = await User.findOne({ _id: req.body.id });
    // let owner = await Owner.findOne({ _id: user.owner });
    let glad = await Gladiator.findOne({ _id: req.body.id });
    glad.schedule = [req.body.day];
    glad.save();
    console.log('  -EN> savingDay',glad.name);
    res.send(glad)
})


module.exports = router