const { Schema, model } = require("mongoose");
const Owner = require('./Owner');
const { getItemEffect } = require('./../../engine/game/itemsIndex');
const { getAbilityEffect } = require('./../../engine/game/abilityIndex');

const gladiatorSchema = new Schema(
	{
        // Game Stats
        name:{
            type:String
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"Owner"
        },
        schedule:[],

        localTournament:{
            type:Boolean
        },
        regionalTournament:{
            type:Boolean
        },
        grandTournament:{
            type:Boolean
        },
        nationalTournament:{
            type:Boolean
        },

        winRecord:{
            type:Number
        },
        loseRecord:{
            type:Number
        },

        exp:{ // experience
            type:Number
        },
        level:{
            type:Number
        },
        age:{ //This might be how many days passed sense start of training. Will be used later on.
            type:Number
        },


        // The following three arrays are linked, learnSkill is the skill learned
        // task Skill is what is replaced
        // Progress Skill is going to be a string that needs to be JSON/Strinify so it tracks
        // how much each skill is being progressed.
        learnSkill:[], 
        
        taskSkill:[],
        progressSkill:{
            type:String
        },

        // Character Points Stats
        hits:{ // Physical Hit points
            type:Number
        },
        mana:{ // Mental Mana Points
            type:Number
        },
        stress:{ // Stress - not certain how this should be used yet.
            type:Number
        }, 
        morale:{ // Morale in fighting.
            type:Number
        },
        stamina:{
            type:Number
        },


        // Physical Stats
        strength:{ // Muscle - how strong one is. 
            type:Number
        },
        dexterity:{ //Work with hands - hand eye thing - hitting
            type:Number
        },
        agility:{ //Speed - Naturally Quick - physical speed - dodging
            type:Number
        },
        constitution:{ //Physical Make up  - resistances to effects
            type:Number
        },
        vitality:{ //Energy - state of being strong/active - hit points
            type:Number
        },
        
        // Mental Stats
        intelligence:{ // the ability to acquire and apply knowledge and skills.
            type:Number
        },
        wisdom:{ // Quality of experience, knowledge and good judgement
            type:Number 
        },
        bravery:{ // Courageous
            type:Number
        },
        piety:{ // Duty to respect religious context 
            type:Number
        },
        sensitivity:{ // Quick to detect changes,signals, or influences
            type:Number
        },

        // Social Stats
        charisma:{  // Attractiveness/charm to inspire others
            type:Number
        },
        luck:{ // Success or failure brought by chance rather than one’s actions
            type:Number
        },
        reputation:{ // Widespread belief of this person.
            type:Number
        },

        // Item slots
        // Using a string to reference an item in the itemsIndex.

        head:{
            type:String
        },
        mainHand:{
            type:String
        },
        offHand:{
            type:String
        },
        body:{
            type:String
        },
        boots:{
            type:String
        },


        //  the difference between an skill and ability is that skills are in teh character abilities are given by items. 
        // But these are both added in the clash/prepair/react.
        skills:[], // Learned stuff
        abilities:[], // Gained from items.

        // These are what is assigned currently to these two sections
        // Do not need a clash - that isn't controlled via
        prepare:[],
        react:[],


	},
);
gladiatorSchema.methods.setSkills = async function() {
    // This will go through equipment and give fill up skills
    // or it will go through 
    const slots = ["mainHand","offHand","head","body","boots"];
    this.abilities = [];
    slots.forEach(slot =>{
        if(this[slot] && getItemEffect(this[slot]) ){
            this.abilities = this.abilities.concat(getItemEffect(this[slot]).abilities);
        }
    });
}
gladiatorSchema.methods.doLevel = async function() {
    // This will go through equipment and give fill up skills
    // or it will go through 
    if(this.age > Math.pow(2,this.level)){
        this.level++;
    }
}


gladiatorSchema.methods.prepareForMemory = async function() {
    let rtnObj = {};
    // this is to create an object that is prepared for save.
	rtnObj.hits = this.hits;
	rtnObj.hits = this.mana;
	rtnObj.morale = this.morale;
	rtnObj.strength = this.strength;
	rtnObj.dexterity = this.dexterity;
	rtnObj.agility = this.agility;
	rtnObj.constitution = this.constitution;
	rtnObj.vitality = this.vitality;
	rtnObj.intelligence = this.intelligence;
	rtnObj.wisdom = this.wisdom;
	rtnObj.bravery = this.bravery;
	rtnObj.piety = this.piety;
	rtnObj.sensitivity = this.sensitivity;
	rtnObj.charisma = this.charisma;
	rtnObj.luck = this.luck;
	rtnObj.reputation = this.reputation;
	rtnObj._id = this._id;

	// Here we will go through items and adjust stats based on items.
	const slots = ["mainHand","offHand","head","body","boots"];
	slots.forEach(slot =>{
		if (this[slot] !== null){
			let item = getItemEffect( this[slot]);
			if(!item && this[slot]){
				console.log(' Error no item return', this[slot]);
			} else if(item &&  item.stats ){
				for(let stat in item.stats){
					console.log(stat,"b4:",rtnObj[stat]);
					rtnObj[stat] = rtnObj[stat] +=  rtnObj[stat] * ( item.stats[stat] * 0.01 );
					console.log(stat,"after:",rtnObj[stat]);
				}
			}
		}
	} )
    rtnObj.prepare = this.prepare;
    rtnObj.react = this.react;
    rtnObj.skills = this.skills;
    return rtnObj;
}

gladiatorSchema.methods.prepareForFight = async function() {
    // This will go through equipment and give fill up skills
    // or it will go through 
    let rtnObj = {};

	rtnObj.maxHits = this.hits;
	rtnObj.maxMana = this.mana;
	rtnObj.maxMorale = this.morale;
	rtnObj.hits = this.hits;
	rtnObj.mana = this.mana;
	rtnObj.morale = this.morale;
	rtnObj.strength = this.strength;
	rtnObj.dexterity = this.dexterity;
	rtnObj.agility = this.agility;
	rtnObj.constitution = this.constitution;
	rtnObj.vitality = this.vitality;
	rtnObj.intelligence = this.intelligence;
	rtnObj.wisdom = this.wisdom;
	rtnObj.bravery = this.bravery;
	rtnObj.piety = this.piety;
	rtnObj.sensitivity = this.sensitivity;
	rtnObj.charisma = this.charisma;
	rtnObj.luck = this.luck;
	rtnObj.reputation = this.reputation;
	rtnObj.name = this.name;
	rtnObj._id = this._id;

	// Here we will go through items and adjust stats based on items.
	const slots = ["mainHand","offHand","head","body","boots"];
	slots.forEach(slot =>{
		if (this[slot] !== null){
			let item = getItemEffect( this[slot]);
			if(!item && this[slot]){
				console.log(' Error no item return', this[slot]);
			} else if(item &&  item.stats ){
				for(let stat in item.stats){
					console.log(stat,"b4:",rtnObj[stat]);
					rtnObj[stat] = rtnObj[stat] +=  rtnObj[stat] * ( item.stats[stat] * 0.01 );
					console.log(stat,"after:",rtnObj[stat]);
				}
			}
		}
	} )

	rtnObj.prepare = this.prepare.map((skill) =>
		getAbilityEffect(skill)
	);
	rtnObj.react = this.react.map((skill) => getAbilityEffect(skill));
	rtnObj.effectToDo = {};

	rtnObj.clash = this.abilities
		.concat(this.skills)
		.map((skill) => {
			const effect = getAbilityEffect(skill);
			if(!effect){
				console.log(' No effect for ',skill);
			}
			 else if (effect.type === "clash") {
				return effect;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined);

    return rtnObj;
}


const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;