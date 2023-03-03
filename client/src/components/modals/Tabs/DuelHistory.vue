<template>
  <div>
    <div class="relative p-6 flex-auto overflow-y-auto bg-yellow-200  h-[10rem]">
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
		<BaseFooter>
      <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')">
        Close
      </button>

		</BaseFooter>
    <div v-if="isModalShown" >
      <Suspense>
        <DuelReplay :report="report" @closeModal="isModalShown=false"/>
      </Suspense>
    </div>    
  </div>
</template>

<script setup>

const apiCall = inject('apiCall');
const {gladId} = defineProps({
  gladId:{
    type:String
  }
})


const isModalShown = ref(false)
const report = ref(null)
const combatReports = ref(null)
const count = ref(0)
const posts = ref([])


function showCombat(evt){
  console.log(posts.value[evt.target.getAttribute("data-index")])
  report.value = posts.value[evt.target.getAttribute("data-index")];
  isModalShown.value = true;
}

onMounted(()=>{
  let observer = new IntersectionObserver(()=>{
              loadMorePosts();
          });
          observer.observe(document.getElementById("intersection"));

})
async function loadMorePosts(){
              const addPosts = 15;
              const rpnse = await fetch(
                apiCall.value + `/gladiator/someDuels/${gladId}/${count.value}/${addPosts}`,
                {headers: { "Content-Type": "application/json" }}
              );
              count.value += addPosts;
              let rn = await rpnse.json();
              posts.value.push(...rn);
            }

</script>

<style scoped>

</style>