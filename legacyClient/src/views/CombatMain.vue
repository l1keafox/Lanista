<template>
  <div class="flex flex-col w-full overflow-x-hidden p-10">
    <h2>Duel your own gladiators</h2>
    <div v-if="getOwner" class="flex">
      <select
        name="gladiator"
        class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
        id="gladiator"
      >
        <option value="empty">Select</option>
        <template
          v-for="(gladiator, index) in getOwner.gladiators"
          :key="index"
        >
          <option :value="gladiator.name">{{ gladiator.name }}</option>
        </template>
      </select>
      vs
      <select
        name="gladiator2"
        class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
        id="gladiator2"
      >
        <option value="empty">Select</option>
        <template
          v-for="(gladiator, index) in getOwner.gladiators"
          :key="index"
        >
          <option :value="gladiator.name">{{ gladiator.name }}</option>
        </template>
      </select>

      <button
        class="bg-yellow-200 text-emerald-800 w-48 p-2 m-2"
        @click="doSpar"
      >
        Spar
      </button>
    </div>

    <hr />
    <br />
    <h2>Spar against a Memory</h2>
    <div v-if="getOwner" class="flex">
      <select
        name="gladiator"
        class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
        id="memoryGlad"
      >
        <option value="empty">Select</option>
        <template
          v-for="(gladiator, index) in getOwner.gladiators"
          :key="index"
        >
          <option :value="gladiator.name">{{ gladiator.name }}</option>
        </template>
      </select>

      <button
        class="bg-yellow-200 text-emerald-800 w-48 p-2 m-2"
        @click="doMemory"
      >
        Fight Memory
      </button>
    </div>
    <hr />
    <h2>Spar against an person's gladiator</h2>
    <div>
      Id:
      <InputField v-model="opponId" />
      vs
      <template v-if="getOwner">
        <select
          name="gladiator2"
          class="bg-cyan-100 w-28 text-purple-800 p-2 m-2"
          id="myPickFightOther"
        >
          <option value="empty">Select</option>
          <template
            v-for="(gladiator, index) in getOwner.gladiators"
            :key="index"
          >
            <option :value="gladiator._id">{{ gladiator.name }}</option>
          </template>
        </select>
      </template>
      <button
        class="bg-yellow-200 text-emerald-800 w-48 p-2 m-2"
        @click="fightTarget"
      >
        Fight Gladiator
      </button>
    </div>
    <hr />
    <br />
    <Clash class="prose bg-slate-300 w-[100rem] p-5" />
    <div v-if="isModalShown">
      <Suspense>
        <DuelReplay :report="duelReport" @closeModal="isModalShown = false" />
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import Clash from "./../content/Clash.md";
import auth from "../composables/auth";
const opponId = ref(null);
const isModalShown = ref(false);
const duelReport = ref(null);
const userData = ref(auth.getUser());

const getOwner = inject("getOwner");
const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

async function fightTarget() {
  let ele = document.getElementById("myPickFightOther");
  const rpnse = await fetch(apiCall.value + `/gladiator/fightTarget`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gladatorId: ele.value,
      targetId: opponId.value,
    }),
  });
}

async function doMemory() {
  let sch = document.getElementById("memoryGlad");
  let gladData = getOwner.value.gladiators.find(
    (glad) => glad.name == sch.value,
  );
  if (gladData) {
    const rpnse = await fetch(apiCall.value + `/gladiator/fightMemory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gladatorId: gladData._id,
        ownerId: this.userData._id,
      }),
    });
    let rpns = await rpnse.json();
    duelReport.value = rpns;
    isModalShown.value = true;
  }
}
async function doSpar() {
  let sch = document.getElementById("gladiator");
  let sch2 = document.getElementById("gladiator2");
  let gladData = getOwner.value.gladiators.find(
    (glad) => glad.name == sch.value,
  );
  let glad2 = getOwner.value.gladiators.find((glad) => glad.name == sch2.value);
  if (gladData && glad2) {
    const rpnse = await fetch(apiCall.value + `/gladiator/doSpar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gladatorId2: glad2._id,
        gladatorId: gladData._id,
        ownerId: userData.value._id,
      }),
    });
    let rpns = await rpnse.json();
    duelReport.value = rpns;
    isModalShown.value = true;
  }
}

onMounted(() => {
  showTutorial({
    elementId: "storeSideNav",
    message: "Store is where you can buy items and buildings",
    orientation: "bottom",
  });
});
</script>

<style scoped></style>
