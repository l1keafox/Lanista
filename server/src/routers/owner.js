
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/owner/structures', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    console.log(owner2.structures);
    res.send(owner2.structures)
})
router.post('/owner/training', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    console.log(owner2.training);
    res.send(owner2.training)
})

router.post('/owner', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    res.send(owner2)
})


module.exports = router