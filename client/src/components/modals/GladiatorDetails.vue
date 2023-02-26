<template>
  <BaseModal noFooter="true">
    <template v-slot:header>
      <h1 v-if="gladiatorData" class="text-3xl font-semibold">
        {{ gladiatorData.name }}
      </h1>
      <!-- <h2 v-if="gladiatorData" class="text-lg font-semibold">
        Id: {{ gladiatorData._id }}
      </h2> -->
      <BaseTabs :tabs="tabs" v-model="currentTab"/>
    </template>
    <template  v-slot:content>
    <component :is="currentTab" @closeModal="$emit('closeModal')" :gladId="gladId" />
    </template>
    <template v-slot:footer ></template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue"
import BaseTabs from "./BaseTabs.vue"


import Equipment from "./Tabs/EquipmentTab.vue"
import Clash from "./Tabs/ClashTab.vue"
import Stats from "./Tabs/StatsTab.vue"
  export default {
    name: "GladiatorStats",
    props: ["gladId","gladMemory"],
    components:{
      Equipment,
      Stats,
      Clash,
      BaseModal,
      BaseTabs
    },
    updated(){
      console.log(currentTab);
    },
    inject:['apiCall'],
    data() {
      this.tabs = ["Stats","Equipment","Clash"]
      return {
        gladiatorData: null,
        currentTab: this.tabs[0],
      };
    },
    methods:{
    },
    async mounted() {
      if(this.gladId){
          const rpnse = await fetch(
          this.apiCall.value+ `/gladiator/${this.gladId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        this.gladiatorData = await rpnse.json();
      } else if(this.gladMemory){
        this.gladiatorData = JSON.parse(this.gladMemory.memory);
            // console.log("THIS",this.gladMemory);
            // console.log("PARSED",this.gladiatorData);
            this.gladiatorData.name = this.gladMemory.name;
            this.gladiatorData.age = this.gladMemory.age;
            this.gladiatorData.level = this.gladMemory.level;
            this.gladiatorData.winRecord = this.gladMemory.winRecord;
            this.gladiatorData.lossRecord = this.gladMemory.lossRecord;

      }
    },
  };
  </script>
  

<style scoped>

</style>