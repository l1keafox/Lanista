<template>
  <div class="flex flex-col w-full overflow-x-hidden  bg-slate-600">
    <h1 class="text-center font-baby text-[3rem] text-black">How to play Lanista</h1>
    <nav class="flex">
      <template v-for="(help,index) in helpObj">
        <button @click="switchHelp(index)" class ="mr-10"> {{ help }}</button>
      </template>
    </nav>
    <component :is="showTo" class="prose bg-slate-200"/>
   </div>
</template>

<script>
import Intro from './../content/Intro.md'
import Clash from './../content/Clash.md'
import Memory from './../content/Memory.md'
import Stats from './../content/Stats.md'

  export default {
      name:"HowToPlayMain",
      components:{
        Stats,
        Memory,
        Intro,
        Clash
      },
      data(){
        this.helpObj = ["Intro","Clash","Memory","Stats","Tournaments","Ranking","Equipment","Building","Training"]
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