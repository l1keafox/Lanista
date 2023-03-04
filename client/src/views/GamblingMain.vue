<template>
  <div class="flex w-full overflow-x-auto flex-wrap flex-col">
      <h1 class="text-center font-dot text-[5rem]">Gambling Halls</h1>
      <h2 class="text-red-500 text-center"> Work in progress </h2>
      <h1> Where you can gamble on Duels or put in your own gladiators for duels</h1>
      <button class="bg-yellow-400 text-black" @click="showEnterModal"> Enter Gladiator</button>
      <br/>
      <p> Later on there will be a table of gladiator fights and time for it to calcuate. You can look at stats/skills of gladiators</p>
  </div>
  <div v-if="showModal" >
    <GamblingModal @closeModal="showEnterModal"/>
  </div>
</template>

<script setup>

const showModal = ref(false);

function showEnterModal(){
  showModal.value = !showModal.value;
}

</script>

<style scoped>

</style>