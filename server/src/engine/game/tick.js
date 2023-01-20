// This is what happens in a tick.
// Game will start on
const { GameDate, Gladiator, Owner } = require("./../../models");
const { doGrowth } = require("./trainingEffects");
const { getAbilityEffect } = require("./abilityIndex");
let date = {
	time: 1, // This is # of events per day maxed at 8
	day: 1, // Days maxed at 30
	month: 1, // maxed at 12
	year: 1, // never maxed?
};

module.exports = {
	doTick: async function () {
		let gameDate = await GameDate.find();
		gameDate = gameDate[0]; // Because there should only be 1 gameDate ever!;
		await gameDate.addTime();
		date = {
			time: gameDate.time,
			day: gameDate.day,
			month: gameDate.month,
			year: gameDate.year,
			weekDay: gameDate.weekDay,
		};

		// Determine tournament date.
		if (date.weekDay == 7 && date.time == 1) {
			console.log("Tournament Day");
			console.log("Tournament Day");
			console.log("Tournament Day");
			console.log("Tournament Day");
			
			// So now we determine if the local,regional,quarter,national.
			if (date.month === 12 && date.day == 28) {
				// national is the last month, and 28th
				console.log("National TOURNAMENT");
			} else if (
				(date.month === 3 || date.month === 6 || date.month === 9) &&
				date.day == 28
			) {
				console.log("Grand TOURNAMENT");
			} else if (date.day == 28) {
				console.log("Regional TOURNAMENT");
			} else {
				console.log("Local TOURNAMENT");
				// So we grab all gladiators that are selected via schedule to do this tournament.
				// We will then make sure they do not do any training that day.
			}
		}
		let allGladiators = await Gladiator.find();
		let ownersGain = {};
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

		const keys = Object.keys(ownersGain);
		const myPromise = new Promise((resolve, reject) => {
			keys.forEach(async (ownerid, index) => {
				let owner = await Owner.findOne({ _id: ownerid });
				// console.log('  -EN/TICK> Owner',owner.userAcct ,': gained  G:',ownersGain[ownerid].gold,"F:",ownersGain[ownerid].fame);
				owner.gold += ownersGain[ownerid].gold;
				owner.fame += ownersGain[ownerid].fame;
				await owner.save();
				if (index === keys.length - 1) {
					resolve("this");
				}
			});
		});
		await myPromise;
	},
	getDate: function () {
		return `Time: ${date.time}:00  ${date.month}/${date.day}/${date.year} weekday:${date.weekDay}`;
	},
};
