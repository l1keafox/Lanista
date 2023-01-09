
const express = require('express');
const {User,Owner,Gladiator,DayEvents} = require('../models');
const auth = require('../middleware/auth');
const {createNewOwner,createNewGladiator} = require('./../engine/game/utils');
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
            const owner = await new Owner( createNewOwner() )
            console.log("  -EN> User creating Owner Model. Starting Default Training");
            owner.structures = [ "School" ];
            owner.inventory = [{type:"shortSword",amount:2} ];
            
            const glad = await new Gladiator( createNewGladiator() );
            console.log("  -EN> Creating Glad:",glad,owner._id);
            glad.schedule.push({1:"chopWood",2:"community",3:"woodCarv",4:"hiking",5:"readBook",6:"pray",7:"lookLost",8:"tough"});
            glad.mainHand="shortSword";
            glad.owner = owner._id;
            owner.gladiators.push(glad.id);
            glad.save();

            const glad2 = await new Gladiator( createNewGladiator() );
            glad2.schedule.push({8:"chopWood",1:"community",2:"woodCarv",3:"hiking",4:"readBook",5:"pray",6:"lookLost",7:"tough"});
            console.log("  -EN> Creating Glad:",glad2);
            glad2.mainHand="shortSword";
            glad2.owner = owner._id;
            owner.gladiators.push(glad2.id);

            glad2.save();

            const glad3 = await new Gladiator( createNewGladiator() );
            glad3.schedule.push({7:"chopWood",8:"community",1:"woodCarv",2:"hiking",3:"readBook",4:"pray",5:"lookLost",6:"tough"});
            console.log("  -EN> Creating Glad:",glad3);
            glad3.owner = owner._id;
            glad3.mainHand="shortSword";

            owner.gladiators.push(glad3.id);
            glad3.save();

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