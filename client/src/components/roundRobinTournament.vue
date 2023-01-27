<template>
    <div>
        <!--Background-->
        <div class="opacity-25 fixed inset-0 bg-black z-40"></div>
      
        <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
          <div class="relative w-auto my-6 mx-auto max-w-6xl ">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <!--header-->
              <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 class="text-3xl font-semibold">
                  RoundRobin - winner : {{ this.tournamentData.winner }}
                </h3>
              </div>
              <!--body-->
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
              <!--footer-->
              <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isModalShown">
          <CombatReview
            :combatReport="combatReport"
            @closeModal="closeModal"
            :glads="glads" />
        </div>
    
      </div>

</template>

<script>
    export default {
        name:"roundRobinReview",
        props:['tournamentData'],
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