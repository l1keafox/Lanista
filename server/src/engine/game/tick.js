// This is what happens in a tick.
// Game will start on
const { GameDate, Gladiator, Owner, Memory, saveTournament, saveDuel } = require("./../../models");
const { doGrowth } = require("./trainingEffects");
const { getAbilityEffect } = require("./abilityIndex");
const { saveModelMemory , saveManyModelMemory } = require('./gladiatorPrep');
const { localTournament,regionalTournament,quarterTournament, nationalTournament } = require('./tournament');
let date = {
	time: 1, // This is # of events per day maxed at 8
	day: 1, // Days maxed at 30
	month: 1, // maxed at 12
	year: 1, // never maxed?
	gladNum:0
};

async function clearSaves(){
	// This function will go through saveTournaments and saveDuels and delete them based on time pased.
	const timePassed = 86400000; // 86400000 ( 60 * 60 * 24 * 1000) is one real day's time 
	const lessThan = new Date() - timePassed; 
	// saveDuel.find({createdAt:{$gl: lessThan }  } );
	saveDuel.deleteMany( {createdAt:{$lt: lessThan }  } ).then( ()=>{
		console.log("  -EN> DELETED OLD DUELS")
	} ).catch((err)=>{
		console.log('err');
	});
	saveTournament.deleteMany( {createdAt:{$lt: lessThan }  } ).then( ()=>{
		console.log("  -EN> DELETED OLD TOURNAMENTS")
	} ).catch((err)=>{
		console.log('err');
	});
}

module.exports = {
	doTick: async function () {
		return new Promise(async (resolve, reject) => {

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
		if (date.weekDay == 7) {
			const startOfTick = new Date();

//			console.log("  -EN>Tournament Day");
			let allNonSeedGlad = allGladiators.filter(glad => {
				glad.age++;
				return !glad.seed 
			});
			await saveManyModelMemory(allGladiators); // uncertain if this works as intended.

 		  	console.log(`  -EN> Saved Gladiators Time: ${new Date()-startOfTick}  :: ${allNonSeedGlad.length}# of glads`);
			
			let memoryByLvl = {};

			async function saveGlads(glads){
				for(let id in glads.toRecordObj.memory){
					let memory = await Memory.findById(id);
					for(let stat in glads.toRecordObj.memory[id]){
						memory[stat] += glads.toRecordObj.memory[id][stat];
					}
					memory.save();
				}
				for(let id in glads.toRecordObj.gladiator){
					let glad = await Gladiator.findById(id);
					for(let stat in glads.toRecordObj.gladiator[id]){
						glad[stat] += glads.toRecordObj.gladiator[id][stat];
					}
					glad.save();
				}
			}
// 			if (date.month === 12 && date.day == 28) {
// // 				// national is roundrobin then a double elimination tournament.
// // 				// national is the last month, and 28th
// // 				// So now we grab an random Memories and add our guy to it.
// // 				// and do a tournament!
// // 				// Should be 124
// 				let ditto = await nationalTournament(allGladiators, memoryByLvl)
// 				await saveGlads(ditto);
// 				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allGladiators.length} saved:${ditto.usedGlads.length}`);
// 			} else  
// 			if ((date.month === 3 || date.month === 6 || date.month === 9) && date.day == 28	) {
				
// 				//Best of three Tournament.
// 				let ditto = await quarterTournament(allNonSeedGlad, memoryByLvl)
// 				await saveGlads(ditto);
// 				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.usedGlads.length}`);

// 			} else if (date.day == 28 ) {
// 				// Should be 32 fighters
// 				// Single elimination.
// 				let ditto = await regionalTournament(allNonSeedGlad,memoryByLvl ); 
// 				await saveGlads(ditto);
//  				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.usedGlads.length}`);

// 			} else {
// //				Local tournament is a round robin
// 				let ditto = await localTournament(allNonSeedGlad); 
// 				await saveGlads(ditto);	
// 				console.log(`    -EN>Tounry>Tournament Took: ${new Date() - startOfTick}ms / # of Loops${allNonSeedGlad.length} saved:${ditto.usedGlads.length}`);
// 			}

			await gameDate.addDay(); // This will set it to the next day.
			if(date.day == 28){
				clearSaves()
			}

		} else {
			// console.log('  -TICK> allGladiators Age++')

			await allGladiators.forEach(async (gladiator) => {
			// before we do growth we need to check too see if this is current a skill replacement.
			if(gladiator.taskSkill[0] ==  gladiator.schedule[0][date.weekDay][date.time] )			{
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
					if (!ownersGain[gladiator.ownerId]) {
						ownersGain[gladiator.ownerId] = {
							gold: 0,
							fame: 0,
						};
					}
					const goldGrowth = growth.find((element) => element.stat === "gold");
					const fameGrowth = growth.find((element) => element.stat === "fame");
					if (goldGrowth) {
						ownersGain[gladiator.ownerId].gold += goldGrowth.amount;
					}
					if (fameGrowth) {
						ownersGain[gladiator.ownerId].fame += fameGrowth.amount;
					}
				}
				} 


			if (date.time === 8) {
				gladiator.age++;
				gladiator.calcuateStats();
				if(gladiator.seed && date.weekDay ==1){
					// This it too make up for tournament say sense seeded guys aren't aged.
					gladiator.age++;
				}
				if(gladiator.age > 2000000){
					console.log(" FORWARD THINKING AGE, add more memoriy arries or not!");
				}
				gladiator.doLevel();
			}
			await gladiator.save();
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
		resolve ("Done");
	});

	},
	getDate: function () {
		return `Gladiator Count: ${date.gladNum}  Time: ${date.time}:00  ${date.month}/${date.day}/${date.year} weekday:${date.weekDay}`;
	},
};
