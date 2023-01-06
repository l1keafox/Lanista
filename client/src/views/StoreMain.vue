<template>
  <div class="flex h-full">
    <div class="bg-slate-900 grow">Store</div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
    
  inject: ["card", "cardTitle"],
  name: "StoreMain",
  components: {},
  data() {
    return {
        userData: auth.getUser(),
        itemData:null,
        structData:null

    };
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner/store`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.userData._id }),
      }
    );
    let storeData = await rpnse.json();
    this.itemData = storeData.items;
    this.structData = storeData.structures;
  },
  methods: {},
};
</script>

<style scoped></style>
