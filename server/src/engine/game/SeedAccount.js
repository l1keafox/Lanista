/*

This is an file just created to create the base seed account. This is an special account that 
will be created first! and will acutally probably be ahead of everyone else by 1 week age wise. (6x8) ticks ahead

The base seed account will create 124 gladiators to grow and seed Memories as they grow. These Memories will be the basis of all tournaments
from here on.

*/
const { User, Owner,Gladiator } = require("./../../models");
const {createNewOwner,createNewGladiator} = require('./utils')
const {doGrowth} = require('./trainingEffects')
const { saveModelMemory } = require('./gladiatorPrep')

async function SeedAccount(){

    console.log("  -SEED> Creating seed account.")
    // first we create the user account
	const newUser = await new User({ username:"seed", email:"seedseed@seed.seed", password:"seeded" });
    console.log("  -SEED> Creating seed USER.")
	//let newOwner = await createOwner(newUser);
    const newOwner = await new Owner(createNewOwner());
	console.log("  -EN> New Owner with new USER Acct created");
    const gladAmount = 124;
    console.log("  -EN> Starting to create ",gladAmount," gladiators");
	for (let i = 0; i < gladAmount; i++) {
		const glad = await new Gladiator(createNewGladiator("default"));
		glad.owner = newOwner._id;
		newOwner.gladiators.push(glad.id);
		await glad.save();
	}
    console.log("  -EN> Finished creating ",gladAmount," gladiators");
    let allGladiators = await Gladiator.find();
    let weekDay = 1;
    let dateTime = 1;
    const doTicks = 200;
    console.log('  -SEED> Tick Growth Start Doing ',doTicks,"ticks for ",allGladiators.length,"gladiators");

		const myPromise = new Promise(async (resolve, reject) => {
			if(allGladiators.length === 0) resolve("this");
            for(let t = 0; t < doTicks ; t++){
                dateTime++;
                if(dateTime > 8){
                    dateTime = 1;
                    weekDay++;
                    if(weekDay > 7){
                        weekDay = 1;
                    }
                }

//                console.log(dateTime,weekDay);
                await allGladiators.forEach(async (gladiator) => {

                    if(weekDay === 7){
                        gladiator.age++;
                        gladiator.doLevel();
                        
                        await saveModelMemory(gladiator);
                    } else {
                        const growth = await doGrowth( gladiator, // This is the glad
                                                       gladiator.schedule[0][weekDay][dateTime] // This is the growth.
                                                       );        
                    }

                    if (dateTime === 8) {
                        gladiator.age++;
                        gladiator.doLevel();
                    }

                });
                if(weekDay == 7){
                    weekDay = 1;
                } 

                    // Here we should save them.
//                    console.log('  -SEED> Seeding Memory for Gladiators');
                    
                
                
            }
            resolve("this");
		});
	await myPromise;    
    console.log('  -SEED> Tick Growth End')
    // Do save
    await allGladiators.forEach(async (gladiator) => { await gladiator.save()  });

	newOwner.userAcct = newUser._id;
	newUser.owner = newOwner._id;

    console.log("  -SEED> Creating seed OWNER.")
	await newOwner.save();
	await newUser.save();

    // then we create the owner account

    // then we create gladiators

}
// const SeedAccount = new Promise((resolve, reject) => {
//             resolve("this");
// });
module.exports = SeedAccount;