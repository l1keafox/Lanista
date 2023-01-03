
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
//const {createNewOwner,createNewGladiator} = require('./../engine/game/utils');
const router = express.Router();

router.post('/gladiator/', async(req, res) => {
    // View logged in user profile
    // let user = await User.findOne({ _id: req.body.id });
    // let owner = await Owner.findOne({ _id: user.owner });
    let owner2 = await Gladiator.findOne({ _id: req.body.id });
    res.send(owner2)
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