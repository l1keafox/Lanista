<template>
  <BaseModal :noFooter="true">
    <template v-slot:header>
      <h1 v-if="gladiatorData" class="text-3xl font-semibold">
        {{ gladiatorData.name }}
      </h1>
      <BaseTabs :tabs="tabs" v-model="currentTab" />
    </template>
    <template v-slot:content>
      <component
        :is="currentTab"
        @closeModal="$emit('closeModal')"
        :gladId="gladId"
      />
    </template>

    <BaseFooter>
      <button
        class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        v-on:click="$emit('closeModal')"
      >
        Close
      </button>
    </BaseFooter>
  </BaseModal>
</template>

<script>
import Memories from "./Tabs/MemoryTab.vue";
import Duels from "./Tabs/DuelHistory.vue";
import Tournaments from "./Tabs/TournamentHistory.vue";
export default {
  name: "HistoryModal",
  props: ["gladId"],
  components: {
    Memories,
    Duels,
    Tournaments,
  },
  inject: ["apiCall"],
  data() {
    this.tabs = ["Memories", "Duels", "Tournaments"];
    return {
      gladiatorData: null,
      currentTab: this.tabs[0],
    };
  },
  methods: {},
  async mounted() {
    console.log(this.currentTab, this.gladId);
    if (this.gladId) {
      const rpnse = await fetch(
        this.apiCall.value + `/gladiator/${this.gladId}`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      this.gladiatorData = await rpnse.json();
    }
    //else if(this.gladMemory){
    //   this.gladiatorData = JSON.parse(this.gladMemory.memory);
    //   this.gladiatorData.name = this.gladMemory.name;
    //   this.gladiatorData.age = this.gladMemory.age;
    //   this.gladiatorData.level = this.gladMemory.level;
    //   this.gladiatorData.winRecord = this.gladMemory.winRecord;
    //   this.gladiatorData.lossRecord = this.gladMemory.lossRecord;
    // }
    console.log(this.gladiatorData);
  },
};
</script>

<style scoped></style>
