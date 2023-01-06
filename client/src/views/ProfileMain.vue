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
      <div v-for="item in inventory" :key="item" class="h-80 aspect-[5/7] p-3 m-3 cursor-default select-none flex flex-col bg-slate-700"> 
        <h2 class="text-xl">{{ item.item }}</h2>
        <hr/>
        <h2>amount:{{ item.amount }}</h2>
        <h2>abilities:{{ item.abilities }}</h2>
        <h2>slot:{{ item.slot }}</h2>
        <h2>cost:{{ item.cost }}</h2>
      </div>

    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
  name: "ProfileMain",
  data() {
    return {
      userData: auth.getUser(),
      ownerData: null,
      inventory:null
    };
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner`,
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id}),
        }      
    );
    let ownerData = await rpnse.json();
    this.ownerData =  ownerData;
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
