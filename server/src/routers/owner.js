
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/owner/structures', async(req, res) => {
    let owner2 = await Owner.findOne({ _id: req.body.id });
    res.send(owner2.structures)
})

router.post('/owner', async(req, res) => {
    let owner2 = await Owner.findOne({ userAcct: req.body.id });
    res.send(owner2)
})


module.exports = router