<template>
  <div>
    <h1>PROFILE PAGE</h1>
    <hr/>
    <h2>Username:  {{ userData.username }}</h2>
    <div v-if="ownerData">
      <h2>GOLD: {{ ownerData.gold }}</h2>
      <h2>FAME: {{ ownerData.fame }}</h2>
    </div>
    <hr/>
    <div v-if="inventory">
      <h1>Inventory</h1>
      <div v-for="item in inventory" :key="item" :class="card"> 
        <h2 :class="cardTitle">{{ item.item }}</h2>
        <hr/>
        <h2>amount:{{ item.amount }}</h2>
        <h2>abilities:{{ item.abilities }}</h2>
        <h2>slot:{{ item.slot }}</h2>
        <h2>maintenance:{{ item.maintenance }}</h2>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileMain",
  inject: ['card','cardTitle','getOwnerData','userData'],
  data() {
    return {
      ownerData: null,
      inventory:null
    };
  },
  async mounted() {
      this.ownerData = this.getOwnerData();

    const inventory = await fetch(
      `http://${window.location.hostname}:3001/owner/inventoryData`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id}),
        }      
    );
    this.inventory = await inventory.json();


  },
};
</script>

<style scoped>
</style>
