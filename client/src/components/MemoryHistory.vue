<template>
    <div>
        <!--Background-->
        <div class="opacity-25 fixed inset-0 bg-black z-40"></div>
      
        <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg"  v-on:click="bgClose($event)" >
          <div class="relative w-auto my-6 mx-auto max-w-6xl">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-96">
              <!--header-->
              <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                Memories
              </div>
              <!--body-->
              <div class="relative p-6 flex-auto  overflow-y-auto bg-yellow-200">
                <template v-for="(memory,index) in memories"
                :key="index">
                <div class="flex justify-between">
                    <div class="flex justify-between"> Age:{{memory.age}}  Lvl:{{memory.level}} Record:{{memory.winRecord}}/{{memory.lossRecord}} Tournament:{{ memory.weekWin }}/{{ memory.monthWin }}/{{ memory.quarterWin }}/{{ memory.yearWin }} </div> <button class="bg-blue-300 text-black" :data-index="index" @click="showMemory($event)"> See Memory </button>
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


        </div>
      </div>
</template>

<script>
    export default {
        name:"MemoryHistory",
        props: ["gladId"],
        data(){
            return {
                gladiatorData: null,
                isModalShown:false,
                count:0,
                memories:[]
            }
        },
        methods:{
            bgClose(event) {
                if (event.target.getAttribute("data-id") === "bg") {
                this.$emit('closeModal')
                }
            },
            async showMemory(event){
              
              console.log(this.memories[event.target.getAttribute("data-index")]);
            },
            async  loadMorePosts(){
              const addPosts = 10;
              this.count += addPosts;
              const rpnse = await fetch(
                `http://${window.location.hostname}:3001/gladiator/someMemories/${this.gladId}/${this.count}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              let rn = await rpnse.json();
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