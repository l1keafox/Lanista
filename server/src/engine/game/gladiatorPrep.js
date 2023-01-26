const { getItemEffect } = require("./itemsIndex");
const { getAbilityEffect } = require("./abilityIndex");
const { Memory } = require("./../../models");
const slots = ["mainHand", "offHand", "head", "body", "boots"];
function modifyStatsFromItems(glad) {
	// Here we will go through items and adjust stats based on items.

	slots.forEach((slot) => {
		if (glad[slot] !== null) {
			let item = getItemEffect(glad[slot]);
			if (!item && glad[slot]) {
				console.log(" Error no item return", glad[slot]);
			} else if (item && item.stats) {
				for (let stat in item.stats) {
					console.log(stat, "b4:", rtnObj[stat]);
					rtnObj[stat] = rtnObj[stat] +=
						rtnObj[stat] * (item.stats[stat] * 0.01);
					console.log(stat, "after:", rtnObj[stat]);
				}
			}
		}
	});
}

function setupClash(glad) {
	// console.log(glad.abilities);
	if (!glad.abilities) {
		// This is a Memory
		glad.abilities = glad.clash;
	}
	return glad.abilities
		.concat(glad.skills)
		.map((skill) => {
			const effect = getAbilityEffect(skill);
			if (!effect) {
				if (skill) {
					console.log("  -ERROR>   No effect for ", skill);
				}
			} else if (effect.type === "clash") {
				return effect;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined);
}

function setupStats(glad) {
	let rtnObj = {};
	rtnObj.hits = glad.hits;
	rtnObj.mana = glad.mana;
	rtnObj.morale = glad.morale;
	rtnObj.stamina = glad.stamina;
	rtnObj.strength = glad.strength;
	rtnObj.dexterity = glad.dexterity;
	rtnObj.agility = glad.agility;
	rtnObj.constitution = glad.constitution;
	rtnObj.vitality = glad.vitality;
	rtnObj.intelligence = glad.intelligence;
	rtnObj.wisdom = glad.wisdom;
	rtnObj.bravery = glad.bravery;
	rtnObj.piety = glad.piety;
	rtnObj.sensitivity = glad.sensitivity;
	rtnObj.charisma = glad.charisma;
	rtnObj.luck = glad.luck;
	rtnObj.reputation = glad.reputation;
	rtnObj._id = glad._id;
	return rtnObj;
}

//saveModelMemory
async function saveManyModelMemory(gladArray){
	let createArray = [];
	for(let gladiator of gladArray){
		if(gladiator.level >= 3){
			let memory = await prepModelForMemory(gladiator);
			memory = JSON.stringify(memory);
			createArray.push(
			 	{
				memory,
				"name": gladiator.name,
				"level": gladiator.level,
				"age": gladiator.age,
				"gladiatorID": gladiator._id,
				"ownerID": gladiator.ownerId,
				"winRecord": 0,
				"lossRecord": 0,
				"weekWin": 0,
				"monthWin": 0,
				"quarterWin": 0,
				"yearWin": 0,
				}
			);
		}
	}
	
	await Memory.insertMany( createArray ).then(
		function(){
			console.group("  -EN/SAVE>Data inserted :",createArray.length);
		}
	);
}


async function saveModelMemory(gladiator) {
	let memory = await prepModelForMemory(gladiator);
	memory = JSON.stringify(memory);

	const gMemory = await new Memory({
		memory,
		"name": gladiator.name,
		"level": gladiator.level,
		"age": gladiator.age,
		"gladiatorID": gladiator._id,
		"ownerID": gladiator.ownerId,
		"winRecord": 0,
		"lossRecord": 0,
		"weekWin": 0,
		"monthWin": 0,
		"quarterWin": 0,
		"yearWin": 0,
	});
	//	console.log(`  -> SAVING GLAD ${name} age:${age} level:${level}`)
	gMemory.save();
}

// prepModelForMemory
async function prepModelForMemory(glad) {
	// glad is to create an object that is prepared for save.
	await glad.setSkills();
	let rtnObj = setupStats(glad);
	modifyStatsFromItems(glad);

	rtnObj.prepare = glad.prepare;
	rtnObj.react = glad.react;

	rtnObj.clash = setupClash(glad).map((clash) => clash.abilityName);

	slots.forEach((slot) => {
		if (glad[slot] !== null) {
			rtnObj[slot] = glad[slot];
		}
	});

	return rtnObj;
}

// prepModelForFight
async function prepModelForFight(glad) {
	// This will go through equipment and give fill up skills
	// or it will go through
	await glad.setSkills();
	let rtnObj = setupStats(glad);
	rtnObj.name = glad.name;
	rtnObj.maxHits = glad.hits;
	rtnObj.maxMana = glad.mana;
	rtnObj.maxMorale = glad.morale;
	rtnObj.maxStamina = glad.stamina;

	modifyStatsFromItems(glad);
	// Here we will go through items and adjust stats based on items.

	rtnObj.prepare = glad.prepare.map((skill) => getAbilityEffect(skill));
	rtnObj.react = glad.react.map((skill) => getAbilityEffect(skill));

	rtnObj.effectToDo = {};

	rtnObj.clash = setupClash(glad);
	return rtnObj;
}

// prepMemoryForFight
async function prepMemoryForFight(gladMem) {
	//	console.log(gladMem,"tds");
	let rtnObj = JSON.parse(gladMem.memory);
	rtnObj.name = gladMem.name;
	rtnObj.maxHits = rtnObj.hits;
	rtnObj.maxMana = rtnObj.mana;

	rtnObj.maxMorale = rtnObj.morale;
	rtnObj.maxStamina = rtnObj.stamina;
	// modifyStatsFromItems(glad); No modifty because it's all saved.
	// now it needs to go through prepare/react/clash and get the acutal abilities.
	rtnObj.prepare = rtnObj.prepare.map((skill) => getAbilityEffect(skill));
	rtnObj.react = rtnObj.react.map((skill) => getAbilityEffect(skill));

	rtnObj.clash = setupClash(rtnObj);
	rtnObj.effectToDo = {};
	// now we should take this Memory Object, and recreate prepModelForMemory
	//	console.log(rtnObj);
	return rtnObj;
}

module.exports = {
	prepModelForMemory,
	prepModelForFight,
	saveModelMemory,
	saveManyModelMemory,
	prepMemoryForFight,
};
