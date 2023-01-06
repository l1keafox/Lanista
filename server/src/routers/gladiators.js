
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/gladiator/', async(req, res) => {
    let gladiator = await Gladiator.findOne({ _id: req.body.id });
    res.send(gladiator)
})

router.post('/gladiator/updateEquipment', async(req, res) => {
    let gladiator = await Gladiator.findOne({ _id: req.body.id });
    req.body.save.forEach(item => {
        gladiator[item.slot] = item.newEquip;
    });
    await gladiator.save();
    res.send(gladiator)
})


router.post('/gladiator/saveDay', async(req, res) => {
    let glad = await Gladiator.findOne({ _id: req.body.id });
    glad.schedule = [req.body.day];
    glad.save();
    console.log('  -EN> savingDay',glad.name);
    res.send(glad)
})


module.exports = router