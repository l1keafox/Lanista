
const express = require('express');
const {User,Owner,Gladiator,DayEvents,saveTournament,saveDuel,GameDate} = require('../models');
const {getTraining} = require('./../engine/game/trainingEffects');
const {getStructureEffect} = require('./../engine/game/structureIndex');
const {getItemEffect} = require('./../engine/game/itemsIndex');
const {getStoreItems} = require('./../engine/game/storeIndex');
const { getAbilityEffect } = require('./../engine/game/abilityIndex');
const {createNewGladiator} = require('./../engine/game/utils')
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/owner/:ownerId', async(req, res) => {
    try{
        const owner = await Owner.findById( req.params.ownerId ).populate('gladiators',['name','age','winRecord','lossRecord','memoryWinRecord','memoryLossRecord','weekWin','monthWin','quarterWin','yearWin','memoryWeekWin','memoryMonthWin','memoryQuarterWin','memoryYearWin','level','lastGain','hairStyleChar','hairChar','skinChar','sexChar']);
        const gameDate = await GameDate.find();

        res.send({owner, time:gameDate[0] })
    }catch(err){
        console.log(err);
        res.send({});
    }
})


router.get('/owner/structures/:ownerId', async(req, res) => {
    const owner2 = await Owner.findById(req.params.ownerId);
    res.send(owner2.structures)
})

router.get('/owner/structuresData/:ownerId', async(req, res) => {
    const owner2 = await Owner.findById(req.params.ownerId);
    const rtnData = owner2.structures.map( struct =>{
        let rtn = getStructureEffect(struct);
        if(rtn){
            rtn.structure = struct;
            return rtn;

        }
    });
    res.send(rtnData);
})

router.post('/owner/removeItems', async(req, res) => {
    // So how we want to do this: is return an object that is organized by slot.
    let owner = await Owner.findOne({ userAcct: req.body.id });
    req.body.remove.forEach(item =>{
        let found = owner.inventory.find( ele => ele.type == item.newEquip );
        if(found) found.amount -= 1;
    });

    // This will go through and clear out 0 and undefined items.
    owner.inventory = owner.inventory.map(item=>{
        if(item && item.amount){
            return item;
        }
    }).filter( ele => {
        return ele !== undefined
    })


    owner.markModified('inventory');
    await owner.save();
    res.send(owner);
})
router.get('/owner/itemsSort/:ownerId', async(req, res) => {
    // So how we want to do this: is return an object that is organized by slot.
    const owner = await Owner.findById(req.params.ownerId);
    const rtn = {};
    owner.inventory.forEach( item =>{
        if(item.amount){
            let itemEffect = getItemEffect(item.type);
            if(!rtn[itemEffect.slot])  rtn[itemEffect.slot] = [];
            rtn[itemEffect.slot].push({type:item.type,number:item.amount } );
        }
    });

    res.send(rtn);
})

router.get('/owner/inventoryData/:ownerId', async(req, res) => {
    const owner = await Owner.findById(req.params.ownerId);
    await owner.getTraining();

    const rtnData = owner.inventory.map( item =>{
            let rtn = getItemEffect(item.type);
            rtn.item = item.type;
            rtn.amount = item.amount;
            return rtn;
        });
    res.send(rtnData);
})

router.get( '/owner/someTournament/:ownerId/:offset/:limit',async(req, res) => {
    // console.log("Some Tourna");
    let mongoose = require('mongoose');
    let id =  mongoose.Types.ObjectId(req.params.ownerId);
    let tournaments = await saveTournament.find({ 'owners': { $elemMatch: {$eq:id} } })
        .populate('gladiators',['name'])
        .populate('memories',['name'])
        .populate('owners',['userName'])
        .skip(req.params.offset)
        .limit(req.params.limit); 

        // let tournaments2 = await saveTournament.find({ 'owners': { $elemMatch: {$eq:id} } })
        // .populate('gladiators',['name'])
        
        // .populate('memories',['name'])
        // .populate('owners',['userName'])
        // console.log(tournaments.length,req.params.offset,"/",tournaments2.length,req.params.limit);
    res.send(tournaments);
} );

router.post('/owner/tournamentRound', async(req, res) => {
    res.send({});
})

// router.post('/owner/training', async(req, res) => {
//     let owner = await Owner.findOne({ userAcct: req.body.id });
//     let rtn = await owner.getTraining();
//     res.send(rtn);
// })
router.get('/owner/training/:ownerId', async(req, res) => {
    //    let owner = await Owner.findOne({ userAcct: req.body.id });
        const owner = await Owner.findById(req.params.ownerId);
        let rtn = await owner.getTraining();
        res.send(rtn);
})

router.get('/owner/learning/:ownerId', async(req, res) => {
//    let owner = await Owner.findOne({ userAcct: req.body.id });
    const owner = await Owner.findById(req.params.ownerId);
    let rtn = await owner.getLearning();
    res.send(rtn);
})

router.post('/owner/learning', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
    let rtn = await owner.getLearning();
    res.send(rtn);
})

router.get('/owner/trainingData/:ownerId', async(req, res) => {
    const owner = await Owner.findById(req.params.ownerId);
    await owner.getTraining();

    const rtnData = owner.training.map( train =>{
        let rtn = getTraining(train);
        if(rtn){
            rtn.training = train;
            return rtn;
        }else {
            console.log("  -EN/ROUTER> traing data failure?",train);
        }
    }  ) .filter((notUndefined) => notUndefined !== undefined);
    res.send(rtnData);
})

router.get('/owner/learningData/:ownerId', async(req, res) => {
    const owner = await Owner.findById(req.params.ownerId);
    await owner.getLearning();
    const rtnData = owner.learning.map( skill =>{
        let rtn = getAbilityEffect(skill);
        if(rtn){
            rtn.learning = skill;
            return rtn;
        } else {
            console.log('  -EN/Router/Owner>leanring data skill missing?',skill);
        }
    });
    res.send(rtnData);
})


let potentialStudents= {};
router.get('/owner/getStudent/:ownerId', async(req, res) => {
    // So get Student will 
    // So how this will work is that server will get an request to get a student
    // it will create an random student, and save it's data in potentialStudents and send the data 
    // to the client for him to decide.
    // const rtnGlad = 1;
    potentialStudents[req.params.ownerId] = [];
    for(let i = 0; i < 4;i++){
        potentialStudents[req.params.ownerId].push(createNewGladiator("default"));
    //    console.log(i, "created",potentialStudents[req.params.ownerId].length);
    }
    res.send (potentialStudents[req.params.ownerId]);
})


router.post('/owner/buyStudent/', async(req, res) => {
    // In this post it will confirm buying th student, so it will 
    const {gladName,ownerId,index} = req.body;
    //console.log(gladName,ownerId);
    if(potentialStudents[ownerId]){
        const owner2 = await Owner.findById(ownerId);
        // console.log(potentialStudents[ownerId][index]);
        const glad = await new Gladiator(potentialStudents[ownerId][index]);
        glad.calcuateGladiator();
        potentialStudents[ownerId].splice(index,1);
        glad.ownerId = owner2._id;
	    owner2.gladiators.push(glad.id);
        console.log(`  -EN> OWNER: ${owner2.name} , Getting glad: ${glad.name}`);

    	await glad.save();
        await owner2.save();
        res.send(true);
        return;
    }
    res.send(false);
})

router.get('/owner/store/:ownerId', async(req, res) => {
    const owner2 = await Owner.findById(req.params.ownerId);
    const storeItems = getStoreItems();

    let rtn = {};
    for(let type in storeItems){
        rtn[type] = storeItems[type].map( ele =>{
            if(type === "items"){
                // Here we need to check if items against fame.
                let item = getItemEffect(ele.type);
                if(owner2.fame >= ele.fame){
                item.type = ele.type;
                item.cost = ele.cost;
                return item;
                }
            } else if(type ==="structures"){
                // Here we need to check if structure doesn't already exist.
                let struct = getStructureEffect(ele.type)
                if(!struct){
                    console.log("  -Missing>",ele.type, "structure not available, need to be created");
                } else 
                if( owner2.fame >= ele.fame && owner2.structures.indexOf(ele.type) < 0){
                    struct.type = ele.type;
                    struct.cost = ele.cost;
                    return struct;
                }
            }
        
        }).filter(notUndefined => notUndefined !== undefined);
    }
    res.send(rtn)
})

router.post('/owner/buyItem', async(req, res) => {
    let owner = await Owner.findOne({ userAcct: req.body.id });
        console.log(req.body.buyThisThing )
    if(owner.gold < req.body.buyThisThing.cost){
        res.send(false);    
        return;
    }
    owner.gold-=req.body.buyThisThing.cost;

        if(req.body.buyThisThing.item){
            const exist = owner.inventory.find( ele => ele.type ==req.body.buyThisThing.item);

            if(exist){
                exist.amount++;
            } else {
                owner.inventory.push({type:req.body.buyThisThing.item,amount:1});
            }
        } else if(req.body.buyThisThing.structure){
            owner.structures.push(req.body.buyThisThing.structure);
        }
    owner.markModified('inventory');
    owner.save();
    res.send(true);
})


router.get('/owner/date', async(req, res) => {
    res.send( gameDate[0] )
})


module.exports = router