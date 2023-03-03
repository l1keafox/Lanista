<template>
  <BaseModal :noFooter="true">
    <template v-slot:header>
      <h1 v-if="gladiatorData" class="text-3xl font-semibold">
        {{ gladiatorData.name }}
      </h1>
      <h1 v-if="memData" class="text-3xl font-semibold">
        {{ memData.name }}
      </h1>
      <!-- <h2 v-if="gladiatorData" class="text-lg font-semibold">
        Id: {{ gladiatorData._id }}
      </h2> -->
      <BaseTabs :tabs="tabs" v-model="currentTab"/>
    </template>
    <template  v-slot:content>
    <component :is="currentTab" @closeModal="$emit('closeModal')" :gladId="gladId" :memoryData="memData"  />
    </template>
    <template v-slot:footer ></template>
  </BaseModal>
</template>

<script>


import Equipment from "./Tabs/EquipmentTab.vue"
import Clash from "./Tabs/ClashTab.vue"
import Stats from "./Tabs/StatsTab.vue"
  export default {
    name: "GladiatorDetails",
    props: ["gladId","gladMemory"],
    components:{
      Equipment,
      Stats,
      Clash,
    },
    inject:['apiCall'],
    data() {
      this.tabs = ["Stats","Equipment","Clash"]
      return {
        gladiatorData: null,
        memData:null,
        currentTab: this.tabs[0],
      };
    },
    methods:{
    },
    async mounted() {
      console.log(this.gladId, this.gladMemory);
      if(this.gladId){
          const rpnse = await fetch(
          this.apiCall.value+ `/gladiator/${this.gladId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        this.gladiatorData = await rpnse.json();
      } else if(this.gladMemory){
          this.memData = JSON.parse(this.gladMemory.memory);
          this.memData.name = this.gladMemory.name;
          this.memData.age = this.gladMemory.age;
          this.memData.level = this.gladMemory.level;
          this.memData.winRecord = this.gladMemory.winRecord;
          this.memData.lossRecord = this.gladMemory.lossRecord;
          console.log("HEREWS?",this.memData);

      }
    },
  };
  </script>
  

<style scoped>

</style>