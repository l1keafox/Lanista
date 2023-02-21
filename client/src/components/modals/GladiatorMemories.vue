<template>
  <BaseModal>
    <template v-slot:header>
      Memories
    </template>

    <template v-slot:content>
      <div class="relative p-6 flex-auto  overflow-y-auto bg-yellow-200">
        <template v-for="(memory,index) in memories"
        :key="index">
        <div class="flex justify-between">
            <div class="flex justify-between"> Age:{{memory.age}}  Lvl:{{memory.level}} Record:{{memory.winRecord}}/{{memory.lossRecord}} Tournament:{{ memory.weekWin }}/{{ memory.monthWin }}/{{ memory.quarterWin }}/{{ memory.yearWin }} </div> <button class="bg-blue-300 text-black" :data-index="index" @click="showMemory($event)"> See Memory </button>
        </div>
        </template>
        <div id="intersection"> </div>


      </div>

    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
  <!-- <div v-if="isModalShown">
    <GladiatorStats @closeModal="closeModal" :gladMemory="Memory" />
  </div> -->

</template>

<script>
import BaseModal from "./BaseModal.vue"
import GladiatorStats from './GladiatorStats.vue'
    export default {
        name:"MemoryHistory",
        props: ["gladId"],
        inject:['apiCall'],
        components:{
          GladiatorStats,
          BaseModal
        },
        data(){
            return {
                // gladiatorData: null,
                isModalShown:false,
                count:0,
                memories:[],
                Memory:null
            }
        },
        methods:{
            async showMemory(event){
            //  console.log(this.memories[event.target.getAttribute("data-index")]);
              this.Memory = this.memories[event.target.getAttribute("data-index")];
                this.isModalShown = true;

            },
            async  loadMorePosts(){
              const addPosts = 10;
              const rpnse = await fetch(
                this.apiCall.value + `/gladiator/someMemories/${this.gladId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              let rn = await rpnse.json();
              this.count += addPosts;
              this.memories.push(...rn);
            },
            closeModal() {
              this.isModalShown = false;
            },

        },
        async mounted(){
            let observer = new IntersectionObserver(()=>{
              this.loadMorePosts();
            });
              observer.observe(document.getElementById("intersection"));
        }
    }
</script>

<style scoped>

</style>