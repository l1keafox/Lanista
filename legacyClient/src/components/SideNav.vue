<template>
  <div class="overflow-y-auto max-h-screen bg-blue-900 w-48">
    <hr />
    <div :class="butnLayout" @click="emit('update:modelValue', 'WelcomeMain')">
      Home
    </div>
    <div
      :class="butnLayout"
      id="howToPlayNav"
      @click="emit('update:modelValue', 'HowToPlayMain')"
    >
      How To Play
    </div>
    <div :class="butnLayout" @click="emit('update:modelValue', 'RankingMain')">
      Ranking
    </div>
    <div :class="butnLayout" @click="emit('update:modelValue', 'FeedbackMain')">
      Feedback/Bugs
    </div>
    <div :class="butnLayout" @click="emit('update:modelValue', 'CreditMain')">
      Credit
    </div>

    <hr />

    <div v-if="getLogged" class="font-dot text-base">
      <div
        :class="butnLayout"
        id="gladSideNav"
        @click="emit('update:modelValue', 'GladiatorsMain')"
      >
        Gladiators
      </div>
      <div
        :class="butnLayout"
        id="schoolSideNav"
        @click="emit('update:modelValue', 'SchoolMain')"
      >
        School
      </div>
      <div
        :class="butnLayout"
        id="combatSideNav"
        @click="emit('update:modelValue', 'CombatMain')"
      >
        Combat
      </div>
      <div
        :class="butnLayout"
        id="storeSideNav"
        @click="emit('update:modelValue', 'StoreMain')"
      >
        Store
      </div>
      <div
        :class="butnLayout"
        id="studentsSideNav"
        @click="emit('update:modelValue', 'StudentMain')"
      >
        Students
      </div>
      <div
        :class="butnLayout"
        id="gamblingSideNav"
        @click="emit('update:modelValue', 'GamblingMain')"
      >
        Gambling
      </div>
      <div
        :class="butnLayout"
        id="tournamentSideNav"
        @click="emit('update:modelValue', 'TournamentMain')"
      >
        Tournament
      </div>
      <div
        :class="butnLayout"
        id="PvpMainNav"
        @click="emit('update:modelValue', 'PvpMain')"
      >
        PvP
      </div>
    </div>
    <hr />
  </div>
</template>

<script setup>
const getLogged = inject("getLogged");
const showTutorial = inject("showTutorial");
const emit = defineEmits(["update:modelValue"]);
const { modelValue } = defineProps({
  modelValue: {
    default: "WelcomeMain",
  },
});

const butnLayout =
  "font-dot text-base text-center w-fill cursor-pointer sideOptions hover:bg-blue-200 hover:text-black py-4 select-none";

onMounted(() => {
  if (getLogged) {
    showTutorial({
      elementId: "gladSideNav",
      message: "Start here to see what gladiators you  have",
      orientation: "bottom",
    });
  }
}),
  onUpdated(() => {
    if (getLogged) {
      showTutorial({
        elementId: "gladSideNav",
        message: "Start here to see what gladiators you  have",
        orientation: "bottom",
      });
    }
  });
</script>

<style scoped>
#vue {
  opacity: 1;
}
.sideOptions {
  color: rgb(200, 200, 200);

  transition: all 0.5s linear;
}
</style>
