const express = require('express');
const {User,Owner,Gladiator,DayEvents,saveDuel,Memory, saveTournament} = require('../models');
const auth = require('../middleware/auth');
const { getAbilityEffect } = require("./../engine/game/abilityIndex");
const { doDuel,parseAndSaveDuel }= require("../engine/game/duel");
const {saveModelMemory, prepMemoryForFight,prepModelForFight,getMemoryGroup} = require('./../engine/game/gladiatorPrep')

const router = express.Router();

router.get('/gladiator/:gladiatorId', async(req, res) => {
    if(!req.params.gladiatorId){
        res.status(400)
        return;
    }
    let gladiator = await Gladiator.findById(req.params.gladiatorId);
    res.send(gladiator)
})

router.post('/gladiator/updateEquipment', async(req, res) => {
    if(!req.body.id){
        res.status(400)
        return
    }

    let gladiator = await Gladiator.findOne({ _id: req.body.id });
    req.body.save.forEach(item => {
        gladiator[item.slot] = item.newEquip;
    });
    await gladiator.save();
    res.send(gladiator)
})

router.post('/gladiator/updateClash', async(req, res) => {
    if(!req.body.id){
        res.status(400)
        return;
    }

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
    if(!req.body.gladatorId || !req.body.gladatorId2  ){
        res.status(400)
        return
    }

    let glad = await Gladiator.findOne({ _id: req.body.gladatorId });
    let glad2 = await Gladiator.findOne({ _id: req.body.gladatorId2 });
    if(glad && glad2){

        let one = await prepModelForFight(glad);
        let two = await prepModelForFight(glad2);

        let report = await doDuel(one,two);
        // this needs to be saved?
        let saved = await parseAndSaveDuel(report);


        res.send(report)
    } else {
        res.send({"error":"Glad/Glad2 error"})
    }
})

router.post('/gladiator/fightMemory', async(req, res) => {
    if(!req.body.gladatorId){
        res.status(400)
        return;
    }

    let glad = await Gladiator.findOne({ _id: req.body.gladatorId });

    if(glad){
        // This is where we get the memory and prepare it as  two;
//         let allMemories = await Memory.find();
// //        console.log(allMemories.length);
//         if(allMemories.length === 0 ){
//             res.send({});
//         }
//console.log(glad.name, glad.level, glad.age);
        const nearBy = await getMemoryGroup(  glad, 2 );
        //  console.log(glad.name);
        // console.log(nearBy[0].name, nearBy[0].level, nearBy[0].age,nearBy.length);
        let randoMemory = nearBy[ Math.floor( Math.random() & nearBy.length ) ] ;
//         console.log(randoMemory.name, randoMemory.memory);
        let one = await prepModelForFight(glad);
        let two;
        if(randoMemory.memory){
            two = await prepMemoryForFight(randoMemory);
        } else {
            two = await prepModelForFight(randoMemory);
        }
        let report = await doDuel(one,two);
        res.send(report)

    }
    // with memory have age and level,
    // level, 
    // and later on you will need to get close age to get the right memory.
    /*let savedDuel = await Memory.find({ 
        //age : {$gt: , %lt:}
        level : req.body.level
     });
     */
    // console.log(savedDuel);
    //return(savedDuel);
});


router.get('/gladiator/clashInfo/:gladiatorId', async(req, res) => {
//    let glad = await Gladiator.findOne({ _id: req.body.id });
if(!req.params.gladiatorId){
    res.status(400)
    return;
}

    let glad = await Gladiator.findById(req.params.gladiatorId);
    // So let's take all the skills and abilities put them in one array as unassigned
    // Then we will organize it as needed, returning an object that will hold 
    glad.calcuateGladiator();
    
    
    const allAbilities = glad.skills.concat(glad.abilities);
//    console.log(allAbilities);
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
    if(!req.body.id){
        res.status(400)
        return;
    }
    let glad = await Gladiator.findOne({ _id: req.body.id });
    if(req.body.scheduleType == "Day"){
        req.body.week[2] = req.body.week[1];
        req.body.week[3] = req.body.week[1];
        req.body.week[4] = req.body.week[1];
        req.body.week[5] = req.body.week[1];
        req.body.week[6] = req.body.week[1];
    }
    glad.schedule = [req.body.week];
    glad.scheduleType = req.body.scheduleType;
    // So given that this is now an week array we need req.body.weekDay
    glad.save();
    console.log('  -EN> savingWeek',glad.name);
    res.send(glad)
})

 router.get('/gladiator/someTournaments/:gladId/:offset/:limit', async(req, res) => {
    if(!req.params.gladId || !req.params.offset || !req.params.limit ){
        res.status(400)
        return;
    }

    let mongoose = require('mongoose');
    let id =  mongoose.Types.ObjectId(req.params.gladId);
    let tournaments = await saveTournament.find({ 'gladiators': { $elemMatch: {$eq:id} } })
    .populate('gladiators',['name'])
    .populate('memories',['name'])
    .populate('owners',['userName'])
    .skip(req.params.offset).limit(req.params.limit)
    res.send(tournaments);
 })

router.get('/gladiator/someMemories/:gladId/:offset/:limit', async(req, res) => {
    if(!req.params.gladId || !req.params.offset || !req.params.limit ){
        res.status(400)
        return;
    }
    let memories = await Memory.find({ gladiatorId : req.params.gladId }).skip(req.params.offset).limit(req.params.limit); 
    res.send(memories);
})

// router.get('/gladiator/allDuels/:gladId', async(req, res) => {
//     let duels = await saveDuel.find({ $or:[{gladiatorOne : req.params.gladId},{gladiatorTwo : req.params.gladId} ] }); 
//     console.log(req.params);
//     console.log(duels.length,"Duels");
//     res.send(duels);
// })
router.get('/gladiator/someDuels/:gladId/:offset/:limit', async(req, res) => {
    if(!req.params.gladId || !req.params.offset || !req.params.limit ){
        res.status(400)
        return;
    }    
    let duels = await saveDuel.find({ $or:[{gladiatorOne : req.params.gladId},{gladiatorTwo : req.params.gladId} ] }).populate('gladiatorTwo',['name']).populate('gladiatorOne',['name']).skip(req.params.offset).limit(req.params.limit); 
    
    res.send(duels);
})

router.get('/gladiator/getDuel/:duelId', async(req, res) => {
    if(!req.params.duelId){
        res.status(400)
        return;
    }    

    let duel = await saveDuel.find({ _id:req.params.duelId } );
    res.send( duel );
})

router.post('/gladiator/saveLearning', async(req, res) => {
    if(!req.body.id){
        res.status(400)
        return;
    }    

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
    
    glad.save();
    console.log('  -EN> SaveLearning',glad.name);
    res.send(glad)
})


module.exports = router