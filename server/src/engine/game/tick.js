// This is what happens in a tick.
// Game will start on 
const { GameDate,Gladiator,Owner } = require("./../../models");
const {doGrowth} = require("./trainingEffects")
let date = {
    time: 1, // This is # of events per day maxed at 8
    day: 1, // Days maxed at 30
    month: 1, // maxed at 12
    year: 1, // never maxed?
}


module.exports = { 
    doTick: async function() {
        let gameDate = await GameDate.find();
        gameDate = gameDate[0]; // Because there should only be 1 gameDate ever!;
        await gameDate.addTime();
        date ={
            time: gameDate.time,
            day: gameDate.day,
            month: gameDate.month,
            year: gameDate.year,
        };

        let allGladiators = await Gladiator.find(); 
        let ownersGain = {};
        await allGladiators.forEach(async gladiator => {
            const growth = await doGrowth(gladiator,gladiator.schedule[0][date.time]);
            console.log(`  -EN/Tick> ${gladiator.name} is training`, gladiator.schedule[0][date.time]);
            if(!ownersGain[gladiator.owner]){
                ownersGain[gladiator.owner] = {
                    gold:0,
                    fame:0
                };
            }
            const goldGrowth = growth.find(element => element.stat === "gold");
            const fameGrowth = growth.find(element => element.stat === "fame");
            if(goldGrowth){
                ownersGain[gladiator.owner].gold  += goldGrowth.amount;
            }
            if(fameGrowth){
                ownersGain[gladiator.owner].fame  += fameGrowth.amount;
            }
            gladiator.save();
        });

        const keys = Object.keys(ownersGain);
        await keys.forEach(async (ownerid) => {
            let owner = await Owner.findOne({ _id:ownerid });
            console.log('  -EN/TICK> Owner',owner.userAcct ,': gained  G:',ownersGain[ownerid].gold,"F:",ownersGain[ownerid].fame);
            owner.gold += ownersGain[ownerid].gold;
            owner.fame += ownersGain[ownerid].fame;
            await owner.save();
        });
        
    },
    getDate: function(){
        return `Time: ${date.time}:00  ${date.month}/${date.day}/${date.year}`
    }

 };
   