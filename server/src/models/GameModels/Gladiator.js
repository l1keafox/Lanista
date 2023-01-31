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

    glad.hits = abilityMix(glad,{"constitution":70,"wisdom":30});
    glad.morale =  abilityMix(glad,{"reputation":50,"bravery":50});
    glad.stamina = abilityMix(glad,{"vitality":80,"sensitivity":20});
    if(glad.intelligence < glad.piety){
        glad.mana = abilityMix(glad,{"intelligence":20, "piety":80});
    } else {
        glad.mana = abilityMix(glad,{"intelligence":80, "piety":20});
    }
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
    if(this.level > 8){
        // 336 days in a year
        if(this.age > 336 * this.level ){
            this.level++;
        }
    } else 
    if(this.age > Math.pow(2,this.level)){
        this.level++;
    }
}


const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;