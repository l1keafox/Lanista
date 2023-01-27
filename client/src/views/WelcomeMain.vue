<template>
    <div class="flex flex-col w-full overflow-x-hidden">
        <div class="bg-slate-900 "> Welcome To Lanista </div>
        <p> This is an always active game, 24 hours every seven days a week. Your gladiators will always be dueling and trainig even if you are not logged in.</p>
        <p> You will need to decided how your gladiators will train every day of the week, decide what skills they will learn and how they will use them</p>
        <p> Last day of the week is tournament week, it rotates from round robin, single elimination, best of three and all of the above tournaments.</p>
        <hr/>
        <h1> How Duels work </h1>
        <p> Clash </p>
        <p> Each round of a duel there is a Clash - which is each gladiator will randomly pick one skill from his skill set.</p>
        <p> Compaired it to the other gladiators skill, each skill has effects and win condidtions against each other.</p>
        <p> Sort of like Rock/Paper/Scissors, the best example would be Strike/Taunt/Dodge</p>
        <P> Strike > Taunt > Dodge > Strike </P>
        <p> If strike is against taunt, it will do hp damage.</p>
        <p> If Taunt is against Dodge, it will do morale damage</p>
        <p> If Dodge is against Strike, it will do Stamina Damage</p>
        <p> Strike vs strike, they both take hits damage based on the other person's strike.</p>
        <p> Dodge Vs Dodge, they will both take stamina damage based on one's own dodge effect</p>
        <p> Taunt vs Taunt, the better taunter will do morale damage against the other</p>
        <p> if  hp, morale or stamina drops to zero, your gladiator will lose.</p>
        <hr/>
        <p> Prepare/React </p>
        <p> Each character can do 1 prepare and 1 react per clash round</p>
        <p> Prepare happens before a clash, and they can have various effects on the clash, but they require a trigger to go in effect.</p>
        <p> A Example of this would be Coup de Grace, if the target gladiator is below 25% health, replace strike with "Execute"</p>
        <p> React happens after a clash, and it's trigger is based on winning/losing/ties in the clash</p>
        <p> A Example of this would be "Heal" if you lose a clash then you can heal.</p>
        <p> Or "Backstab" if you win a "dodge" clash, you can back stab for extra damage.</p>
        <hr/>
        <h1> Equipment </h1>
        <p> Weapons will give you clash abilities, and increase/decrease stats </p>
        <p> Dagger - Will give you "stab","backstab" and increase your dexterity and agility </p>
        <p> ShortSword - Will give you "slash","backstab" </p>
        <p> longsword - will give you "slash" and increase your strength and dexterity</p>
        <hr/>
        <h1> Memories </h1>
        <p> Each Tournament round your gladiator will have a Memory of that week, and it will be stored for future gladiators to fight.</p>
    </div>
</template>

<script>
    export default {
        name:"WelcomeMain",
        components:{
        },
        data(){
            return {
                
            }
        },
        
        methods:{
        },  

    }
</script>

<style scoped>

</style>