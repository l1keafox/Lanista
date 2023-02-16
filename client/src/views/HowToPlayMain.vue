<template>
  <div class="flex flex-col w-full overflow-x-hidden">
    <h1 class="text-center font-baby text-[3rem]">How to play Lanista</h1>
    <h1 class="text-center text-red-500 text-xl"> Work in progress </h1>
      <p> Schedule </p>
      <p> Memory </p>
      <p> History </p>
      <p> Clash </p>
      <p> Stats </p>
      <p> Combat </p>
      <p> Each round of a duel there is a Clash - which is each gladiator will randomly pick one skill from his skill set.</p>
      <p> Compaired it to the other gladiators skill, each skill has effects and win condidtions against each other.</p>
      <p> Sort of like Rock/Paper/Scissors, the best example would be Strike/Taunt/Dodge</p>
      <p> Strike > Taunt > Dodge > Strike </p>
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
      name:"HowToPlayMain",
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