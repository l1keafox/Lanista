const { Schema, model } = require("mongoose");
const Owner = require('./Owner');
const { getItemEffect } = require('./../../engine/game/itemsIndex');

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

        learning:{
            type:Number
        },
        afterLearning:{
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

const Gladiator = model("gladiator", gladiatorSchema);

module.exports = Gladiator;