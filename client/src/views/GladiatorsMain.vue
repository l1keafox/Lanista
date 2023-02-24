<template>
  <div  class="flex flex-wrap w-full overflow-y-scroll  ">
    <template v-if="ownerData" v-for="glad in ownerData.gladiators" :key="glad" > 
      <GladiatorCard :glad="glad"/>
    </template>
  </div>
</template>

<script>
import GladiatorCard from "../components/GladiatorCard.vue";
export default {
    
  name: "GladiatorMain",
  data() {
    return {
      ownerData: null,
    };
  },
  inject: ['getOwner'],
  components:{
    GladiatorCard
  },
  async mounted() {
    this.ownerData = this.getOwner;
  },
};
</script>

<style scoped>

</style>
