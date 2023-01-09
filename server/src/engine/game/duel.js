const { getAbilityEffect } = require("./abilityIndex");
const {
	doEffects,
	compareEffects,
	addEffect,
} = require("./Abilities/abilityEffects");
const { getItemEffect } = require("./itemsIndex");
function returnPreparedGladiator(gladiator) {
  // gladiator prep stuff.
  gladiator.setSkills();

	let newGladObj = {};
	newGladObj.maxHits = gladiator.hits;
	newGladObj.maxMana = gladiator.mana;
	newGladObj.maxMorale = gladiator.morale;
	newGladObj.hits = gladiator.hits;
	newGladObj.mana = gladiator.mana;
	newGladObj.morale = gladiator.morale;
	newGladObj.strength = gladiator.strength;
	newGladObj.dexterity = gladiator.dexterity;
	newGladObj.agility = gladiator.agility;
	newGladObj.constitution = gladiator.constitution;
	newGladObj.vitality = gladiator.vitality;
	newGladObj.intelligence = gladiator.intelligence;
	newGladObj.wisdom = gladiator.wisdom;
	newGladObj.bravery = gladiator.bravery;
	newGladObj.piety = gladiator.piety;
	newGladObj.sensitivity = gladiator.sensitivity;
	newGladObj.charisma = gladiator.charisma;
	newGladObj.luck = gladiator.luck;
  newGladObj.reputation = gladiator.reputation;
	newGladObj.name = gladiator.name;
	newGladObj._id = gladiator._id;

	newGladObj.prepare = gladiator.prepare.map((skill) =>
		getAbilityEffect(skill)
	);
	newGladObj.react = gladiator.react.map((skill) => getAbilityEffect(skill));
	newGladObj.effectToDo = {};

	newGladObj.clash = gladiator.abilities
		.concat(gladiator.skills)
		.map((skill) => {
			const effect = getAbilityEffect(skill);
			if (effect.type === "clash") {
				return effect;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined);

	newGladObj.getClash = function () {
		return newGladObj.clash[
			Math.floor(Math.random() * newGladObj.clash.length)
		];
	};
	newGladObj.doAction = function (Ability, targetChar) {
		console.log(
			"  =EN/DUEL/ATTK>",
			Ability.abilityName,
			this.name,
			"is the character attacking doing effect",
			
			"too target",
			targetChar.name
		);
		Ability.doAbility(this, targetChar);
	};

	newGladObj.addEffect = function (effectName, effectStr) {
		addEffect(this, effectName, effectStr);
	};
	newGladObj.endOfRound = function () {
		for (let aReaction of this.react) {
			if (aReaction.cooldown) aReaction.cooldown--;
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

	newGladObj.clashReact = function (clashResult, target) {
//		console.log("  -En/DUEL>getting clashReSULt for,", this.name, "is", clashResult);
		for (let aReaction of this.react) {
			if (aReaction.cooldown) continue;
			aReaction.doClash(clashResult, this, target);
		}
	};
	return newGladObj;
}
class Clash {
	battle(oneChar, twoChar) {
		// Clash Arrays
		// This will return a clash type instead of array
		const oneClash = oneChar.getClash();
		const twoClash = twoChar.getClash();
		
		// Do action and get results
		oneChar.doAction(oneClash, twoChar);
		twoChar.doAction(twoClash, oneChar);

		const EventResults = {};
		// Here we need to cancel out effects based on actions
		// dodge cancels out damage
		compareEffects(oneChar);
		compareEffects(twoChar);

		// Determine win condidtion
		const oneWinPoints = oneClash.winCondition(oneChar, twoChar); // win condidtions also do the effects too.
		const twoWinPoints = twoClash.winCondition(twoChar, oneChar); // win condidtions also do the effects too.

		// Determine winner
		const difference = Math.abs(oneWinPoints - twoWinPoints);

		let tieLine = (oneWinPoints+twoWinPoints)*.5 *.1;
		console.log(`  =>${oneChar.name}: ${oneWinPoints}, ${twoChar.name}: ${twoWinPoints} =  ${difference} TIELINE:${tieLine}`);
		if (difference < tieLine) {
			EventResults.clashWinner = null; // tie
		} else if (oneWinPoints > twoWinPoints) {
			EventResults.clashWinner = oneChar;
			EventResults.clashLoser = twoChar;
		} else {
			EventResults.clashWinner = twoChar;
			EventResults.clashLoser = oneChar;
		}
		if(EventResults.clashWinner){
			console.log(`  -EN/DUEL>Winner is: ${EventResults.clashWinner.name} w/ ${oneClash.abilityName}, Loser is : ${EventResults.clashLoser.name} w ${twoClash.abilityName}`)
		} else {
			console.log(`  -EN/DUEL>TIE is: ${oneChar.name} w/ ${oneClash.abilityName}, TIE is : ${twoChar.name} w ${twoClash.abilityName}`)
		}
		

		return EventResults;
	}
}

async function doDuel(one, two) {
	// Import things to note - we need it recorded so we can send it back to the users.
	// So, let's take the glads and rebuild the game object for a one time use.
	let report = {};
	let gladOne = returnPreparedGladiator(one);
	let gladTwo = returnPreparedGladiator(two);
	console.log("  -EN/Duel> ", gladOne.name,"Vs", gladTwo.name);
	
	let roundCnt = 0;
	do {
		let thisRound = {};
		roundCnt++;
		console.log(
			`  -EN/Duel>___________________________PRE:${roundCnt}_________________________________`
		);
		// Do prepare
		gladOne.clashPrepare(gladTwo);
		gladTwo.clashPrepare(gladOne);

    // We do effects twice, once before the clash clears it out.
    // Do we compare effects again here? in general prepare shouldn't be about
    // doding, and if it is, it's more enhancing existing clash abilities. 
		doEffects(gladOne);
		doEffects(gladTwo);

		console.log(
			`  -EN/Duel>___________________________CLASH:${roundCnt}_______________________________`
		);
		// doClash clash returns result
		let thisClash = new Clash().battle(gladOne, gladTwo);
		console.log(
			`  -EN/Duel>___________________________REACT:${roundCnt}_______________________________`
		);

		// Do  react
		if (!thisClash.clashWinner) {
			console.log("  -EN/Duel>   TIE");
			gladOne.clashReact("tie", gladTwo);
			gladTwo.clashReact("tie", gladOne);
		} else {
			thisClash.clashWinner.clashReact("win", thisClash.clashLoser);
			thisClash.clashLoser.clashReact("lose", thisClash.clashWinner);
		}

		// Do effects after the clash and before end of round.
		doEffects(gladOne);
		doEffects(gladTwo);

		// Do end of round cooldown reduction, and resets skills if needed.
		gladOne.endOfRound(); //
		gladTwo.endOfRound(); //

		console.log(`  -EN/Duel> ${gladOne.name}     vs     ${gladTwo.name}`);
		console.log(
			"  -EN/Duel> HP:",
			gladOne.hits,
			"/",
			gladOne.maxHits + "    HP:" + gladTwo.hits,
			"/",
			gladTwo.maxHits
		);
		console.log("  -EN/Duel> Morale:", gladOne.morale + "     Morale:" + gladTwo.morale);
		console.log(thisRound);
		report[roundCnt] = thisRound;
	} while (1 == 2);
	//console.log("finished");
	// while(gladOne.hitPoints > 0 &&
	//     gladTwo.hitPoints > 0 &&
	//     gladOne.morale > 0 &&
	//     gladTwo.morale > 0)
	return report;
}

module.exports = { doDuel };
