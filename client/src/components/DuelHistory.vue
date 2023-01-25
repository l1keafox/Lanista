<template>
    <div>
        <!--Background-->
        <div class="opacity-25 fixed inset-0 bg-black z-40"></div>
      
        <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
          <div class="relative w-auto my-6 mx-auto max-w-6xl ">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-96">
              <!--header-->
              <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <!-- <h3 v-if="gladiatorData" class="text-3xl font-semibold"> -->
                  Duel History
                <!-- </h3> -->
              </div>
              <!--body-->
              <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
                <template v-for="(duel,index) in posts"
                :key="index">
                <div class="flex justify-between">
                    <div><h2>{{duel.gladiatorOne.name}} vs {{duel.gladiatorTwo.name}}</h2> </div> <button class="bg-blue-300 text-black" :data-index="index" @click="showCombat($event)"> See Duel </button>
                </div>
                </template>
                <div id="intersection"> </div>
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
import CombatReview from "@/components/CombatReview";
    export default {

        name:"DuelHistory",
        props: ["gladId"],
        components:{
          CombatReview
        },
        data(){
          return{
            isModalShown:false,
            combatReport: null,
            count:0,
            posts: []
          }
        },
        async mounted(){
          let observer = new IntersectionObserver(()=>{
              this.loadMorePosts();
          });
          observer.observe(document.getElementById("intersection"));

        },
        unmounted(){
        },
        updated(){
        },
        methods:{
            async showCombat(event){
                let test = this.posts[event.target.getAttribute("data-index") ];
                let rpns = await JSON.parse (test.duel);
                this.combatReport = rpns;
                this.glads = rpns.fighters;				

                this.isModalShown = true;
            },
            closeModal() {
              this.isModalShown = false;
            },
            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                    this.$emit('closeModal')
                }
            },
            async  loadMorePosts(){
              const addPosts = 15;
              this.count += addPosts;
              const rpnse = await fetch(
                `http://${window.location.hostname}:3001/gladiator/someDuels/${this.gladId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              let rn = await rpnse.json();
              this.posts.push(...rn);
            }
        }

    }
</script>

<style scoped>

</style>