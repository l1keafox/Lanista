<template>
  <div class="relative p-6 flex-auto">
    <div v-if="gladiatorData" class="flex" id="statsTut">
      <div class="flex p-2 flex-col h-48 w-48 bg-slate-800" id="pointsTut">
        <h1>Stat Points</h1>
        <h2>hits:{{ gladiatorData.hits }}</h2>
        <h2>stamina:{{ gladiatorData.stamina }}</h2>
        <h2>morale:{{ gladiatorData.morale }}</h2>
      </div>
      <div class="flex p-2 flex-col h-48 w-48 bg-green-800" id="recordTut">
        <h1>Record</h1>
        <h2>Age: {{ gladiatorData.age }}</h2>
        <h2>Level: {{ gladiatorData.level }}</h2>
        <h2>Wins: {{ gladiatorData.winRecord }}</h2>
        <h2>Losses: {{ gladiatorData.lossRecord }}</h2>
      </div>

      <div class="flex p-2 flex-col h-48 w-48 bg-blue-800" id="physicalTut">
        <h1>Physical</h1>
        <h2>strength:{{ gladiatorData.strength }}</h2>
        <h2>dexterity:{{ gladiatorData.dexterity }}</h2>
        <h2>agility:{{ gladiatorData.agility }}</h2>
        <h2>constitution:{{ gladiatorData.constitution }}</h2>
        <h2>vitality:{{ gladiatorData.vitality }}</h2>
      </div>
      <div class="flex p-2 flex-col h-48 w-48 bg-red-800" id="mentalTut">
        <h1>Mental</h1>
        <h2>intelligence:{{ gladiatorData.intelligence }}</h2>
        <h2>wisdom:{{ gladiatorData.wisdom }}</h2>
        <h2>bravery:{{ gladiatorData.bravery }}</h2>
        <h2>sensitivity:{{ gladiatorData.sensitivity }}</h2>
      </div>
      <div class="flex p-2 flex-col h-48 w-48 bg-yellow-800" id="socialTut">
        <h1>Social</h1>
        <h2>luck:{{ gladiatorData.luck }}</h2>
        <h2>reputation:{{ gladiatorData.reputation }}</h2>
        <h2>charisma:{{ gladiatorData.charisma }}</h2>
      </div>
    </div>
  </div>
  <BaseFooter>
    <button
      class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      v-on:click="$emit('closeModal')"
    >
      Close
    </button>
  </BaseFooter>
</template>

<script setup>
const showTutorial = inject("showTutorial");
const props = defineProps({
  gladId: {
    type: String,
    default: "",
  },
  memoryId: {},
  memoryData: {},
});
const { gladId, memoryId, memoryData } = toRefs(props);
const emit = defineEmits(["closeModal"]);
const apiCall = inject("apiCall");
const gladiatorData = ref(null);

onMounted(async () => {
  showTutorial({
    elementId: "statsTut",
    message: "Here are your stats, broken into 5 groups ",
    orientation: "bottom",
  });
  showTutorial({
    elementId: "pointsTut",
    message:
      "These stats are for battle, if any of these hits 0 you will lose your duel",
    orientation: "bottom",
  });
  showTutorial({
    elementId: "recordTut",
    message: "This is your age in days, and record your gladitors memories.",
    orientation: "bottom",
  });
  showTutorial({
    elementId: "physicalTut",
    message:
      "This is physical stats, one of these is used in most offensive and defensive abilities",
    orientation: "bottom",
  });
  showTutorial({
    elementId: "mentalTut",
    message:
      "These determine your mental stats, while not as focused on physical, they are used in more abilities",
    orientation: "bottom",
  });
  showTutorial({
    elementId: "socialTut",
    message:
      "These stats will be used in your taunting abilities. Luck is used in almost every stat.",
    orientation: "bottom",
  });
  setTimeout(async () => {
    if (gladId.value) {
      const rpnse = await fetch(apiCall.value + `/gladiator/${gladId.value}`, {
        headers: { "Content-Type": "application/json" },
      });
      gladiatorData.value = await rpnse.json();
    } else if (memoryData.value) {
      gladiatorData.value = memoryData.value;
    }
  }, 150);
});
</script>

<style scoped></style>
