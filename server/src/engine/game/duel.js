const SHOWBATTLE = false;
const { getAbilityEffect } = require("./abilityIndex");
const {
	doEffects,
	compareEffects,
	addEffect,
} = require("./Abilities/abilityEffects");
const { getItemEffect } = require("./itemsIndex");
const {Memory} = require('./../../models');
const { prepareForMemory, prepareForFight  } = require('./gladiatorPrep')

async function returnPreparedGladiator(gladiator) {
	// gladiator prep stuff.
	await gladiator.setSkills();
	let newGladObj = prepareForFight(gladiator);

	newGladObj.getClash = function () {
		return newGladObj.clash[
			Math.floor(Math.random() * newGladObj.clash.length)
		];
	};
	newGladObj.doAction = function (Ability, targetChar) {
		if (SHOWBATTLE)
			console.log(
				"  =EN/DUEL/ATTK>",
				Ability.abilityName,
				this.name,
				"is the character attacking doing effect",

				"too target",
				targetChar.name
			);
		return Ability.doAbility(this, targetChar);
	};
	newGladObj.abilityMix = function (statObj){
		// input is
		// num is an whole num * .01;
		// { "stat":num, }
		let total = 0;
		for(let stat in statObj){
		  if(statObj[stat] > 1){
			statObj[stat] = statObj[stat] * 0.01;
		  }
		  total += this[stat] * [statObj[stat]];
		}
		return total;
	  }
	  

	newGladObj.addEffect = function (effectName, effectStr) {
		addEffect(this, effectName, effectStr);
	};
	newGladObj.endOfRound = function () {
		for (let aReaction of this.react) {
			if (aReaction.cooldown) {
				console.log(aReaction.abilityName, aReaction.cooldown,this.name)
				aReaction.cooldown--;
			}
		}
		for (let thisGuy of this.prepare) {
			if (thisGuy.cooldown) thisGuy.cooldown--;
		}
	};
	newGladObj.clashPrepare = function (target) {
		for (let aPrepare of this.prepare) {
			if (aPrepare.cooldown) continue;
			aPrepare.forClash(this, target);
		}
	};

	newGladObj.clashReact = function ( target) {
		console.log("  -En/DUEL>getting clashReSULt for,", this.name, "is",this.clashResult,"abilityWanted:",this.clashAbility,"Is effects",this.effectToDo);
		for (let aReaction of this.react) {
			
			if (aReaction.cooldown) {
//				console.log(aReaction)
				continue;
			}
//			console.log(aReaction.cooldown , aReaction.maxCooldown)
			//aReaction.cooldown = aReaction.maxCooldown;
//			console.log("REACT ABILITY",aReaction)
			return aReaction.doClash(this, target);
		}
	};
//	console.log(newGladObj);
	return newGladObj;
}
class Clash {
	battle(oneChar, twoChar) {
		// Clash Arrays
		// This will return a clash type instead of array
		const oneClash = oneChar.getClash();
		const twoClash = twoChar.getClash();
		oneChar.clashAbility = oneClash.abilityName;
		twoChar.clashAbility = twoClash.abilityName;
		// Do action and get results
		const oneEffect = oneChar.doAction(oneClash, twoChar);
		const twoEffect = twoChar.doAction(twoClash, oneChar);

		const EventResults = {};
		// Here we need to cancel out effects based on actions
		// dodge cancels out damage
		compareEffects(oneChar, twoChar);
		compareEffects(twoChar, oneChar);

		// Determine win condidtion
		const oneWinPoints = oneClash.winCondition(oneChar, twoChar); // win condidtions also do the effects too.
		const twoWinPoints = twoClash.winCondition(twoChar, oneChar); // win condidtions also do the effects too.

		// Determine winner
		const difference = Math.abs(oneWinPoints - twoWinPoints);

		let tieLine = (oneWinPoints + twoWinPoints) * 0.5 * 0.1;
		//console.log(`  =>${oneChar.name}: ${oneWinPoints}, ${twoChar.name}: ${twoWinPoints} =  ${difference} TIELINE:${tieLine}`);
		if (difference < tieLine) {
			EventResults.clashWinner = null; // tie
		} else if (oneWinPoints > twoWinPoints) {
			EventResults.clashWinner = oneChar;
			EventResults.clashLoser = twoChar;
		} else {
			EventResults.clashWinner = twoChar;
			EventResults.clashLoser = oneChar;
		}
		// if(EventResults.clashWinner){
		// 	console.log(`  -EN/DUEL>Winner is: ${EventResults.clashWinner.name} w/ ${oneClash.abilityName}, Loser is : ${EventResults.clashLoser.name} w ${twoClash.abilityName}`)
		// } else {
		// 	console.log(`  -EN/DUEL>TIE is: ${oneChar.name} w/ ${oneClash.abilityName}, TIE is : ${twoChar.name} w ${twoClash.abilityName}`)
		// }
		EventResults.report = {};
		EventResults.report[oneChar.name] = {
			"winPoints": oneWinPoints,
			"clashAbility": oneClash.abilityName,
			"effect": oneEffect
		};
		EventResults.report[twoChar.name] = {
			"winPoints": twoWinPoints,
			"clashAbility": twoClash.abilityName,
			"effect": twoEffect
		};

		return EventResults;
	}
}

async function saveMemory(gladiator){
	let name = gladiator.name;
	let level = gladiator.level;
	let memory = prepareForMemory(gladiator);
		memory = JSON.stringify( memory );
	let age = gladiator.age;
	let gladiatorID = gladiator._id;
	let ownerID = gladiator.owner;
	let win = 0;
	let loss = 0;
	const gMemory = await new Memory( {name,level,age,memory,gladiatorID,ownerID } );	
	console.log(`  -> SAVING GLAD ${name} age:${age} level:${level}`)
	gMemory.save();
}

async function prepMemory(gladMem){
	console.log(gladMem,"tds");
	let rtnObj = JSON.parse(gladMem.memory);
	console.log(rtnObj);
	rtnObj.name = gladMem.name;
	
	// now it needs to go through prepare/react/clash and get the acutal abilities.

	// now we should take this Memory Object, and recreate prepareForMemory 

}
async function doDuel(gladOne, gladTwo) {
	// Import things to note - we need it recorded so we can send it back to the users.
	// So, let's take the glads and rebuild the game object for a one time use.
	// Most things should return a report? Or should we pass the report to it so it can use it?
	const startOfTick = new Date();
	let report = {};
//	let gladOne = await returnPreparedGladiator(one);
//	let gladTwo = await returnPreparedGladiator(two);
	
	//saveMemory(one);
	//saveMemory(two);

	if (SHOWBATTLE) console.log("  -EN/Duel> ", gladOne.name, "Vs", gladTwo.name);

	let roundCnt = 0;
	do {
		console.log("NEW ROUND -------------------------------")
		let roundReport = {};
		roundReport[gladOne.name] = {};
		roundReport[gladTwo.name] = {};
		//		let oneReport = {}; // each gladiator will have different reports
		//		let twoReport = {};
		roundCnt++;
		if (SHOWBATTLE)
			console.log(
				`  -EN/Duel>___________________________PRE:${roundCnt}_________________________________`
			);
		// Do prepare
		gladOne.clashPrepare(gladTwo);
		gladTwo.clashPrepare(gladOne);

		// We do effects twice, once before the clash clears it out.
		// Do we compare effects again here? in general prepare shouldn't be about
		// doding, and if it is, it's more enhancing existing clash abilities.
		// doEffects(gladOne);
		// doEffects(gladTwo);

		if (SHOWBATTLE)
			console.log(
				`  -EN/Duel>___________________________CLASH:${roundCnt}_______________________________`
			);
		// doClash clash returns result
		let thisClash = new Clash().battle(gladOne, gladTwo);
		if (SHOWBATTLE)
			console.log(
				`  -EN/Duel>___________________________REACT:${roundCnt}_______________________________`
			);
		//console.log( thisClash.report );
		roundReport[gladOne.name].clash = thisClash.report[gladOne.name];
		roundReport[gladTwo.name].clash = thisClash.report[gladTwo.name];
		// Do  react
		if (!thisClash.clashWinner) {
			if (SHOWBATTLE) console.log("  -EN/Duel>   TIE");
			gladTwo.clashResult = "tie";
			gladOne.clashResult = "tie";
			roundReport[gladOne.name].react = gladOne.clashReact(gladTwo);
			roundReport[gladTwo.name].react = gladTwo.clashReact(gladOne);
			roundReport.clashResult = { result: "tie", winner: null };
		} else {
			thisClash.clashWinner.clashResult = "win";
			thisClash.clashLoser.clashResult = "lose";
			roundReport[thisClash.clashWinner.name].react =  thisClash.clashWinner.clashReact( thisClash.clashLoser);
			roundReport[thisClash.clashLoser.name].react = thisClash.clashLoser.clashReact(thisClash.clashWinner);

			roundReport.clashResult = {
				result: "win",
				winner: thisClash.clashWinner.name,
			};

		}

		// Do effects after the clash and before end of round.
		const reportEffectOne = doEffects(gladOne);
		const reportEffectTwo = doEffects(gladTwo);
		roundReport[gladOne.name].effect = reportEffectOne;
		roundReport[gladTwo.name].effect = reportEffectTwo;
		// Do end of round cooldown reduction, and resets skills if needed.
		gladOne.endOfRound(); //
		gladTwo.endOfRound(); //

		if (SHOWBATTLE)
			console.log(`  -EN/Duel> ${gladOne.name}     vs     ${gladTwo.name}`);
		if (SHOWBATTLE)
			console.log(
				"  -EN/Duel> HP:",
				gladOne.hits,
				"/",
				gladOne.maxHits + "    HP:" + gladTwo.hits,
				"/",
				gladTwo.maxHits
			);
		if (SHOWBATTLE)
			console.log(
				"  -EN/Duel> Morale:",
				gladOne.morale + "     Morale:" + gladTwo.morale
			);

		report[roundCnt] = roundReport;
		report.maxRound = roundCnt;
	} while (
		gladOne.hits > 0 &&
		gladTwo.hits > 0 &&
		gladOne.morale > 0 &&
		gladTwo.morale > 0
	);

	report.final = {};
	if (!gladOne.hits || gladOne.morale) {
		report.final.winner = gladTwo.name;
	} else {
		report.final.winner = gladOne.name;
	}
	report.final[gladOne.name] = {
		hits: gladOne.hits,
		morale: gladOne.morale,
	};
	report.final[gladTwo.name] = {
		hits: gladTwo.hits,
		morale: gladTwo.morale,
	};

	console.log(`  -EN> Game DUEL : ${gladOne.name} Vs ${gladTwo.name} TIME: ${new Date() - startOfTick}ms Winner:${report.final.winner} `);
	return report;
}

module.exports = { doDuel ,returnPreparedGladiator , saveMemory,prepMemory };
