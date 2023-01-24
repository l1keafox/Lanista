// This is what happens in a tick.
// Game will start on
const { GameDate, Gladiator, Owner, Memory } = require("./../../models");
const { doGrowth } = require("./trainingEffects");
const { getAbilityEffect } = require("./abilityIndex");
const { saveModelMemory } = require('./gladiatorPrep');
const { localTournament,regionalTournament,quarterTournament, nationalTournament } = require('./tournament');
let date = {
	time: 1, // This is # of events per day maxed at 8
	day: 1, // Days maxed at 30
	month: 1, // maxed at 12
	year: 1, // never maxed?
	gladNum:0
};

module.exports = {
	doTick: async function () {

		let gameDate = await GameDate.find();
		gameDate = gameDate[0]; // Because there should only be 1 gameDate ever!;
		await gameDate.addTick();
		date = {
			time: gameDate.time,
			day: gameDate.day,
			month: gameDate.month,
			year: gameDate.year,
			weekDay: gameDate.weekDay,
		};
		// Determine tournament date.
		// So, Tournament days just do not have gladiator growth, all gladiators are required to do this
		// Why not have it optional?
		let allGladiators = await Gladiator.find();
		date.gladNum = allGladiators.length;

		let ownersGain = {};
		if (date.weekDay == 7 ) {
			const startOfTick = new Date();

//			console.log("  -EN>Tournament Day");
			let allNonSeedGlad = [];
// 			allGladiators.forEach(async (gladiator) => {
			for(let gladiator of allGladiators){
				if(gladiator.level >= 3){
					await saveModelMemory(gladiator);
				}
				
				if(!gladiator.seed){
					allNonSeedGlad.push(gladiator);
				}
			}
 //			});
 		  	console.log(`  -EN> Saved Gladiators ${startOfTick-new Date()} Starting Tournament  :: ${allNonSeedGlad.length}`);
			
			let memoryByLvl = {};
			let allMemory = await Memory.find();
			allMemory.forEach( mem =>{
				if(!memoryByLvl[ mem.level ]){
					memoryByLvl[ mem.level ] = [];
				}
				memoryByLvl[ mem.level ].push(mem);
			} );
			// for(let lvl in memoryByLvl){
			// 	console.log(lvl, "s and Memory in them:", memoryByLvl[lvl].length );
			// }
			// So now we determine if the local,regional,quarter,national.
			if (date.month === 12 && date.day == 28) {
				// national is roundrobin then a double elimination tournament.
				// national is the last month, and 28th
				// So now we grab an random Memories and add our guy to it.
				// and do a tournament!
				// Should be 124
				let ditto = await await nationalTournament(allGladiators, memoryByLvl)
//				console.log("National TOURNAMENT");
				for(let i in ditto){
					if(!ditto[i].memory){
						ditto[i].age++;
					}
					await ditto[i].save();
				}
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allGladiators.length} saved:${ditto.length}`);

			} else  
			if ((date.month === 3 || date.month === 6 || date.month === 9) && date.day == 28	) {
				
				//Double elimination Tournament.
				let ditto = await quarterTournament(allNonSeedGlad, memoryByLvl)
//				console.log("Quarter TOURNAMENT Memberes:",allNonSeedGlad.length);
				for(let i in ditto){
					if(!ditto[i].memory){
						ditto[i].age++;
					}
					await ditto[i].save();
				}
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.length}`);

			} else if (date.day == 28) {
				// Should be 32 fighters
				// Single elimination.
			//	console.log("Regional TOURNAMENT");
				let ditto = await regionalTournament(allNonSeedGlad,memoryByLvl ); 
			//	console.log(ditto.length,"Regional TOURNAMENT END",allNonSeedGlad.length);
				for(let i in ditto){
					if(!ditto[i].memory){
						ditto[i].age++;
					}
					await ditto[i].save();
				}
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.length}`);

			} else {
				// Local tournament is a round robin
			//	console.log("Local TOURNAMENT Start",allNonSeedGlad.length);
				let ditto = await localTournament(allNonSeedGlad,memoryByLvl ); 
			//	console.log(ditto.length,"Local TOURNAMENT END",allNonSeedGlad.length);
				for(let i in ditto){
					if(!ditto[i].memory){
						ditto[i].age++;
					}
					await ditto[i].save();
				}
				// So we grab all gladiators that are selected via schedule to do this tournament.
				// We will then make sure they do not do any training that day.
				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.length}`);
			}

			await gameDate.addDay(); // This will set it to the next day.

		} else {
			//console.log('  -TICK> Do Growth')

			await allGladiators.forEach(async (gladiator) => {
//			console.log(gladiator.schedule[0][date.weekDay][date.time], gladiator.name,"learning",gladiator.learnSkill,gladiator.taskSkill,gladiator.progressSkill);
			// before we do growth we need to check too see if this is current a skill replacement.
			if(gladiator.taskSkill[0] ==  gladiator.schedule[0][date.weekDay][date.time] )			{
				console.log("SKILL REPLACE");
				// now it's replaces we need to 				
				let progress = JSON.parse(gladiator.progressSkill);
				let skill = getAbilityEffect( gladiator.learnSkill[0]);

				progress[ gladiator.learnSkill[0] ] +=  skill.learnSpeed;

				if(progress[ gladiator.learnSkill[0] ] >= 100){
					// Learned this skill!
					// we add it to skills
					gladiator.skills.push(  gladiator.learnSkill[0]  );
					// we remove taskSkill
					gladiator.taskSkill.pop();
					// we remove LearnSkill
					gladiator.learnSkill.pop();
				}


				gladiator.progressSkill = JSON.stringify(progress);

			} else {

				const growth = await doGrowth(
					gladiator,
					gladiator.schedule[0][date.weekDay][date.time]
				);
				// console.log(`  -EN/Tick> ${gladiator.name} is training`, gladiator.schedule[0][date.weekDay][date.time]);
				if (growth) {
					if (!ownersGain[gladiator.owner]) {
						ownersGain[gladiator.owner] = {
							gold: 0,
							fame: 0,
						};
					}
					const goldGrowth = growth.find((element) => element.stat === "gold");
					const fameGrowth = growth.find((element) => element.stat === "fame");
					if (goldGrowth) {
						ownersGain[gladiator.owner].gold += goldGrowth.amount;
					}
					if (fameGrowth) {
						ownersGain[gladiator.owner].fame += fameGrowth.amount;
					}
				} 
			}


			if (date.time === 8) {
				gladiator.age++;
				if(gladiator.age > 2000000){
					console.log(" FORWARD THINKING AGE, add more memoriy arries or not!");
				}
				gladiator.doLevel();
			}
			//
			gladiator.save();
			});
		}
		

		const keys = Object.keys(ownersGain);
		const myPromise = new Promise((resolve, reject) => {
			//resolve("this");
			keys.forEach(async (ownerid, index) => {
				let owner = await Owner.findOne({ _id: ownerid });
				// console.log('  -EN/TICK> Owner',owner.userAcct ,': gained  G:',ownersGain[ownerid].gold,"F:",ownersGain[ownerid].fame);
				if(owner){
				owner.gold += ownersGain[ownerid].gold;
				owner.fame += ownersGain[ownerid].fame;
				await owner.save();
				}
				if (index === keys.length - 1) {
					resolve("this");
				}
			});

		});
		if(keys.length > 0){
			await myPromise;
		}
		await gameDate.save();

	},
	getDate: function () {
		return `Gladiator Count: ${date.gladNum}  Time: ${date.time}:00  ${date.month}/${date.day}/${date.year} weekday:${date.weekDay}`;
	},
};
