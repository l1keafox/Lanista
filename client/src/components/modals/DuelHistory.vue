<template>
  <BaseModal>
    <template v-slot:header>
      Duel History
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200">
        <template v-for="(duel,index) in posts"
        :key="index">
        <div class="flex justify-between">
            <div><h2>{{duel.gladiatorOne.name}} vs {{duel.gladiatorTwo.name}}</h2> </div> 
            <div>
            <button class="bg-blue-300 text-black px-2" :data-index="index" @click="showCombat($event)"> See Duel </button>
            <!-- <button class="bg-blue-300 text-black px-2 " :data-index="index" @click="deleteDuel($event)"> Delete </button> -->
            </div>
        </div>
        </template>
        <div id="intersection"> </div>
      </div>
    </template>

    <template v-slot:footer>
    </template>

    <template v-slot:modal>
      <div v-if="isModalShown" class="fixed z-50">
        <Suspense>
          <DuelReplay :duelId="duelId" @closeModal="closeModal"/>
        </Suspense>
      </div>
    </template>

  </BaseModal>
  
</template>

<script>
import BaseModal from "./BaseModal.vue"
import DuelReplay from "./DuelReplay.vue"

    export default {

        name:"DuelHistory",
        props: ["gladId"],
        inject:['apiCall'],
        components:{
          BaseModal,
          DuelReplay
        },
        data(){
          return{
            isModalShown:false,
            duelId:null,
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
                // this.combatReport = rpns;
                // this.glads = rpns.fighters;				
                this.duelId = test._id;
                this.isModalShown = true;
                console.log("TEST?",this.duelId,this.isModalShown);
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
              const rpnse = await fetch(
                this.apiCall.value + `/gladiator/someDuels/${this.gladId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              this.count += addPosts;
              let rn = await rpnse.json();
              this.posts.push(...rn);
            }
        }

    }
</script>

<style scoped>

</style>