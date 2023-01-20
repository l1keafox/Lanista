const express = require('express');
const {User,Owner,Gladiator,DayEvents,saveDuel} = require('../models');
const auth = require('../middleware/auth');
const { getAbilityEffect } = require("./../engine/game/abilityIndex");
const { doDuel }= require("../engine/game/duel");
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

router.post('/gladiator/updateClash', async(req, res) => {
    let gladiator = await Gladiator.findOne({ _id: req.body.id });
    // validate
    
    console.log(req.body.save);
    for(let slot in req.body.save){
        if(gladiator[slot])
        gladiator[slot] = req.body.save[slot];
    }
    await gladiator.save();

    res.send(true);
})

router.post('/gladiator/doSpar', async(req, res) => {
    let glad = await Gladiator.findOne({ _id: req.body.gladatorId });
    let glad2 = await Gladiator.findOne({ _id: req.body.gladatorId2 });
    if(glad && glad2){
        let report = await doDuel(glad,glad2);


        // Here we save it? 
        let owner = await Owner.findOne({ userAcct: req.body.ownerId });
        //saveDuel
        const savedDuel = await new saveDuel({ "gladiatorOne":req.body.gladatorId ,"gladiatorTwo":req.body.gladatorId2 ,duel: JSON.stringify(report) } );
        //console.log(savedDuel);
        // owner.history.push(savedDuel);
        // if(owner.history.length > 10){
        //     const deleted = owner.history.pop();
        //     console.log('We should also go through saveDuels and delete this',deleted);
        // }
        owner.save();
        savedDuel.save();
        res.send(report)
    } else {
        res.send({"error":"Glad/Glad2 error"})
    }
})

router.post('/gladiator/getDuelHistory', async(req, res) => {
    let savedDuel = await saveDuel.findOne({ _id: req.body.historyId });
    // console.log(savedDuel);
    return(savedDuel);
});


router.post('/gladiator/clashInfo', async(req, res) => {
    let glad = await Gladiator.findOne({ _id: req.body.id });
    // So let's take all the skills and abilities put them in one array as unassigned
    // Then we will organize it as needed, returning an object that will hold 
    glad.setSkills();
    
    
    const allAbilities = glad.skills.concat(glad.abilities);
    console.log(allAbilities);
    let rtn = {
        prepare:[],
        unPrepare:[],
        clash:[],
        react:[],
        unReact:[]
    };
    allAbilities.forEach(abi => {
//        console.log(getAbilityEffect(abi).type , abi);
        // here we determine if it goes to the unassigned or not.
        if(!getAbilityEffect(abi) ){
            console.log( `  -> no ${abi} Availbae, needs to be added`);
        } else if( getAbilityEffect(abi).type  !== "clash"){
            if( !glad[getAbilityEffect(abi).type].includes(abi) ){
//                console.log( abi , "is not in ",getAbilityEffect(abi).type,glad[getAbilityEffect(abi).type]);
                if(getAbilityEffect(abi).type  === 'prepare'){
                    rtn.unPrepare.push(abi);
                }
                if(getAbilityEffect(abi).type  === 'react'){
                    rtn.unReact.push(abi);
                }

            } else {
                rtn[getAbilityEffect(abi).type].push(abi);
            }
        } else {
            rtn[getAbilityEffect(abi).type].push(abi);
        }

    });
    res.send(rtn)
})

// router.post('/gladiator/saveDay', async(req, res) => {
//     let glad = await Gladiator.findOne({ _id: req.body.id });
    
//     glad.schedule = [req.body.day];
//     // So given that this is now an week array we need req.body.weekDay
//     glad.save();
//     console.log('  -EN> savingDay',glad.name);
//     res.send(glad)
// })
router.post('/gladiator/saveWeek', async(req, res) => {
    let glad = await Gladiator.findOne({ _id: req.body.id });
    
    glad.schedule = [req.body.week];
    // So given that this is now an week array we need req.body.weekDay
    glad.save();
    console.log('  -EN> savingWeek',glad.name);
    res.send(glad)
})

router.post('/gladiator/saveLearning', async(req, res) => {
    let glad = await Gladiator.findOne({ _id: req.body.id });
    
    glad.learnSkill = [req.body.skill];
    glad.taskSkill = [req.body.task];

    if(!glad.progressSkill){
        let newProgressSkillObj = {};
        newProgressSkillObj[req.body.skill] = 0;
        glad.progressSkill  = JSON.stringify(newProgressSkillObj)
    } else {
        let progress = JSON.parse(glad.progressSkill);
        if(progress[req.body.skill] === undefined){
            progress[req.body.skill] = 0;
        }
        glad.progressSkill  = JSON.stringify(progress)
    }
    
    // So given that this is now an week array we need req.body.weekDay
    glad.save();
    console.log('  -EN> SaveLearning',glad.name);
    res.send(glad)
})


module.exports = router