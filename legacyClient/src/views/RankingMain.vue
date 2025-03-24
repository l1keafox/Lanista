<template>
  <div class="flex w-full flex-col overflow-x-auto flex-wrap p-5">
    <h1 class="text-center font-dot text-[5rem]">Ranking</h1>
    <div v-if="rankInfo" class="flex flex-col justify-center items-center">
      <h2>Based on points calcuation = # of wins * (wins/total)</h2>
      <br />
      <div v-for="entry in rankInfo.ranking" class="flex flex-col w-[30rem]">
        <div class="flex w-full justify-between">
          <h2>{{ entry.points }}</h2>
          <h2>{{ entry.comment }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const apiCall = inject("apiCall");
const rankInfo = ref();
onMounted(async () => {
  const rpnse = await fetch(unref(apiCall) + `/users/getRankings`, {
    headers: { "Content-Type": "application/json" },
  });
  let rpn = await rpnse.json();
  rankInfo.value = rpn[0];
});
</script>

<style scoped></style>
