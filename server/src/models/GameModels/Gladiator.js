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
        ownerId:{
            type:Schema.Types.ObjectId,
            ref:"Owner"
        },
        seed:{
            type:Boolean
        },
        schedule:[],
        scheduleType:{
            type:String,
            default: "Day"
        },
        lastGain:[String],

        winRecord:{
            type:Number
        },
        lossRecord:{
            type:Number
        },

        weekWin:{
            type:Number
        },
        monthWin:{
            type:Number
        },
        quarterWin:{
            type:Number
        },
        yearWin:{
            type:Number
        },

        level:{
            type:Number
        },
        age:{ //This might be how many days passed sense start of training. Will be used later on.
            type:Number
        },


        // Physical 
        hairStyleChar:{
            type:String
        },
        hairChar:{
            type:String
        },
        skinChar:{
            type:String
        },
        sexChar:{
            type:String
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

function calcauateBase(glad){

    // Mmm here we should change calcuateGladiator into calcuateStuff
    // It will keep looking at this.
   
    function abilityMix (glad,statObj){
		// input is
		// num is an whole num * .01;
		// { "stat":num, }
		let total = 0;
		for(let stat in statObj){
		  if(statObj[stat] > 1){
			statObj[stat] = statObj[stat] * 0.01;
		  }
		  total += glad[stat] * [statObj[stat]];
		}
		return Math.round(total * 0.1);
	}    

    glad.hits = abilityMix(glad,{"constitution":50,"wisdom":25,"bravery":25});
    glad.stamina = abilityMix(glad,{"vitality":50,"intelligence":25,"sensitivity":25});
    glad.morale =  abilityMix(glad,{"reputation":33,"bravery":33,"luck":33});
    // if(glad.intelligence < glad.piety){
    //     glad.mana = abilityMix(glad,{"intelligence":20, "piety":80});
    // } else {
    // }
    glad.mana = abilityMix(glad,{"intelligence":80});
}

gladiatorSchema.methods.calcuateGladiator = async function() {
    // This will go through equipment and give fill up skills
    // or it will go through 
    const slots = ["mainHand","offHand","head","body","boots"];
    this.abilities = [];
    slots.forEach(slot =>{
        if(this[slot] && getItemEffect(this[slot]) ){
            this.abilities = this.abilities.concat(getItemEffect(this[slot]).abilities);
        }
    });
    calcauateBase(this);
}

gladiatorSchema.methods.calcuateStats = async function() {
    calcauateBase(this);
}


gladiatorSchema.methods.doLevel = async function() {
    // This will go through equipment and give fill up skills
    // or it will go through 
     if(this.level == 1){
        if(this.age > 28){ // takes 28 days to lv 2
            this.level++;
        }
    } else if(this.level == 2){
        if(this.age > 114){ // takes 3 months to lv 3
            this.level++;
        }
    } else if(this.level == 3){
        if(this.age > 228){ // takes 6 months to lv 4
            this.level++;
        }
    } else if(this.level == 4){
        if(this.age > 456){  // takes 1 year to lv 5
            this.level++;
        }
    } else if(this.level < 10) {
        // Up to level 10 it should be hevery half year.
        if(this.age > (228 * (this.level -5) )+456 ){
            this.level++;
        }
    } else {
        // 336 days in a year
        if(this.age > (456 * (this.level -5) )+456 ){
            this.level++;
        }
    } 

    // 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 /
    // 1 / 2 / 4 / 8 / 16/ 32/ 64/128/256/512
}


const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;