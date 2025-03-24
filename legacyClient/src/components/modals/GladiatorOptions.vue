<template>
  <BaseModal>
    <template v-slot:header>
      <h1> Options </h1>
    </template>

    <template v-slot:content>
      <div class="flex flex-col m-2">
        <div class="flex justify-between items-center">
          <h1> Start Gladiator training: </h1>
            {{ gladData.isEnabled }}
          <button class="p-2 bg-blue-300 text-slate-800" v-if="gladData.isEnabled"> Disable </button>
          <button class="p-2 bg-red-300 text-slate-800" v-else @click="sendEnabled"> enable </button>
        </div>
        <div class="flex justify-between items-center">
          <h1> Retire Gladiator </h1>
          <button class="p-2 bg-blue-300 text-slate-800"> Retire </button>
        </div>
      </div>
    </template>

    <template v-slot:footer>
    </template>
  </BaseModal>
</template>

<script setup>
const props = defineProps(['gladData']);
const modalData = inject('modalData')
console.log(modalData.value.gladData);
const gladData = ref(modalData.value.gladData)

const apiCall = inject('apiCall')
async function sendEnabled(evt){
  
	 const rpnse = await fetch(apiCall.value + `/gladiator/enable/${gladData.value._id}/true`, {
	 	headers: { "Content-Type": "application/json" },
	 });
   gladData.value = await rpnse.json();
   
   alert("Next tick it will be enabled")
}
</script>

<style scoped>

</style>
