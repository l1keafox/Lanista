<template>
  <div class="flex flex-col w-full overflow-x-hidden  ">
    <h1 class="text-center font-dot text-[3rem] text-white">How to play Lanista</h1>
    <BaseTabs :tabs="helpObj" v-model="showTo"/>
    <div class = "p-4 w-full bg-slate-300 overflow-auto ">
      <component :is="showTo" class="prose"/>
    </div>
   </div>
</template>

<script>
import Intro from './../content/Intro.md'
import Clash from './../content/Clash.md'
import Memory from './../content/Memory.md'
import Stats from './../content/Stats.md'
import Tournament from './../content/Tournament.md'
import Ranking from  './../content/Ranking.md'
import Equipment from  './../content/Equipment.md'
import Building from  './../content/Building.md'
import Training from  './../content/Training.md'
import Balance from  './../content/Balance.md'

  export default {
      name:"HowToPlayMain",
      components:{
        Stats,
        Training,
        Building,
        Tournament,
        Equipment,
        Memory,
        Ranking,
        Intro,
        Balance,
        Clash
      },
      data(){
        this.helpObj = ["Intro","Clash","Training","Memory","Stats","Tournament","Ranking","Equipment","Building","Balance"]
          return {
              showTo:"Intro"
          }
      },
      
      methods:{
        switchHelp(evt){
          this.showTo = this.helpObj[evt];
        }
      },  

  }
</script>

<style scoped>

</style>