<template>
  <div class="flex w-full overflow-x-auto flex-wrap">
    <template v-if="tournaments">
      <div v-for="(tourny, index) in tournaments" :key="index" class="">
        <div :class="largeCard">
          <h1>{{ tourny.tournament.type }}</h1>
          <hr />
          <button
            class="bg-yellow-200 m-2 p-3 text-black"
            @click="showDetailModal($event)"
            :data-type="tourny.tournament.type"
            :data-index="index"
          >
            Show Details
          </button>
          <div class="overflow-y-auto h-full">
            <template v-for="(glad, index2) in tourny.gladiators" :key="index2">
              <template v-if="gladOwned(glad)">
                <h2 class="text-red-500">**{{ glad.name }}**</h2>
              </template>
              <template v-else>
                <h2>{{ glad.name }}</h2>
              </template>
            </template>
            <template v-for="(glad, index) in tourny.memories" :key="index">
              <template v-if="gladOwned(glad)">
                <h2 class="text-red-500">**{{ glad.name }}**</h2>
              </template>
              <template v-else>
                <h2>{{ glad.name }}</h2>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div
        id="intersection"
        class="bg-yellow-100"
        @click="this.loadMorePosts"
      ></div>
    </template>
    <div v-if="isModalShown">
      <component
        :is="components[tournamentType]"
        :tournamentData="tournamentData"
        @closeModal="closeModal"
      >
      </component>
    </div>
  </div>
</template>

<script setup>
import bestOfThree from "./../components/modals/BestOfThreeModal.vue";
import roundRobin from "./../components/modals/RoundRobin.vue";
import singleElimination from "./../components/modals/SingleElimination.vue";
import roundRobinBestOfThree from "./../components/modals/RoundRobinOfThree.vue";
const components = {
  roundRobin,
  singleElimination,
  bestOfThree,
  roundRobinBestOfThree,
};

const getUser = inject("getUser");
const largeCard = inject("largeCard");
const getOwner = inject("getOwner");
const apiCall = inject("apiCall");

onMounted(() => {
  let observer = new IntersectionObserver(loadMorePosts);
  observer.observe(document.getElementById("intersection"));
});

const isModalShown = ref(false);
const tournamentType = ref(null);
const tournamentData = ref(null);
const tournaments = ref([]);

let count = 0;

function showDetailModal(event) {
  const tournKey = {
    weekly: "roundRobin",
    monthly: "singleElimination",
    quarter: "bestOfThree",
    quater: "bestOfThree",
    year: "roundRobinBestOfThree",
    yearly: "roundRobinBestOfThree",
  };

  tournamentType.value = tournKey[event.target.getAttribute("data-type")];
  tournamentData.value =
    tournaments.value[event.target.getAttribute("data-index")].tournament;

  isModalShown.value = true;
}
function gladOwned(glad) {
  let rsult = getOwner.value.gladiators.findIndex((ownedGlad) => {
    return glad.name == ownedGlad.name;
  });
  return rsult > -1;
}
function closeModal() {
  isModalShown.value = false;
}
async function loadMorePosts() {
  const addPosts = 10;
  const rpnse = await fetch(
    apiCall.value +
      `/owner/someTournament/${getUser.value.ownerId}/${count}/${addPosts}`,
    { headers: { "Content-Type": "application/json" } },
  );
  let rn = await rpnse.json();
  count += addPosts;
  rn.forEach((tourn) => {
    tourn.tournament = JSON.parse(tourn.tournament);
  });

  tournaments.value.push(...rn);
}
</script>

<style scoped></style>
