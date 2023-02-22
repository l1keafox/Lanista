<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold">
        RoundRobin - winner : 
      </h3>
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
        <div v-for="(glad,index) in this.gladiatorObj " :key="index" class="flex justify-between">  
            <h1> {{index}} </h1> 
            <div>
            <select name="mainHand" class="bg-cyan-100 w-28" id="mainHand"> 
              <option value="empty">vs select</option>
              <template v-for="(vsGlad, index) in glad" :key="index">
                <option :value="vsGlad.duelId">{{ vsGlad.vs }} </option>
              </template>
            </select>
            <button @click="ShowDuel">
              Show
            </button>
            </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue"
    export default {
        name:"roundRobinReview",
        props:['tournamentData'],
        components:{
          BaseModal
        },
        data(){
          return {
            gladiatorObj : {}
          }
        },
        async mounted(){
            //let grab = this.tournamentData.duelReport[0];
            // We going to use a drop down menu, so let's first organlize the data by users.
            this.gladiatorObj = {};
            console.log(this.tournamentData);
            if(this.tournamentData){
            this.tournamentData.tournamentStructure.forEach( duel =>{

              if(!this.gladiatorObj[duel[1]]){
                this.gladiatorObj[duel[1]] = [{duelId:duel.saveId, vs:duel[2]}];
              } else {
                this.gladiatorObj[duel[1]].push({duelId:duel.saveId, vs:duel[2]})
              }
              if(!this.gladiatorObj[duel[2]]){
                this.gladiatorObj[duel[2]] = [{duelId:duel.saveId, vs:duel[1]}];
              } else {
                this.gladiatorObj[duel[2]].push({duelId:duel.saveId, vs:duel[1]})
              }
              //console.log( duel[1], duel[2], duel.saveId )
            } );
          }
            console.log(this.gladiatorObj);
        },
        methods:{
            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                    this.$emit('closeModal')
                }
            },
            ShowDuel(){

            }

        },
    }
</script>

<style scoped>

</style>