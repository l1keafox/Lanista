
const express = require('express');
const {User,Owner} = require('../models');
const auth = require('../middleware/auth');
const {createNewOwner} = require('./../engine/game/utils');
const router = express.Router();

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        console.log("  -MON>New user:",req.body);
        const user = new User(req.body)
        await user.save();
        const token = await user.generateAuthToken();
        console.log(token);
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { username, password } = req.body;
        if(!username){
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const user = await User.findByCredentials(username, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken();
        // Here we should create owner 
        if(!user.owner){
            const owner = new Owner(createNewOwner())
            console.log("  -EN> User creating Owner Model.");
            user.owner = owner._id;
            owner.userAcct = user._id;
            user.save();
            owner.save();
        }
        
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})
router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router