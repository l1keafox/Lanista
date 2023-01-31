<template>
  <div class="flex flex-col w-full overflow-x-hidden">
    <h1>ITEMS:</h1>
    
    <div v-if="itemData" class="flex overflow-x-auto">
      <template v-for="(item, index) in itemData" :key="index">
        <itemCard :data="item" @buyThing="buyThing('item',index)"/>
      </template>
    </div>

    <hr />
    <h1>Head Armor:</h1>

    <div v-if="headData" class="flex overflow-x-auto">
      <template v-for="(item, index) in headData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('item',index)"/>
      </template>
    </div>

    <hr />
    <h1>Structures:</h1>
    <div v-if="structData"  class="flex overflow-x-auto">

      <template v-for="(struct, index) in structData" :key="index">
        <itemCard :data="struct" @buyThing="buyThing('struct',index)"/>

      </template>
    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
import itemCard from "./../components/ItemCard"
export default {
  inject: ["card", "cardTitle","smallCard"],
  name: "StoreMain",
  methods: {
    async buyThing(type, index) {
      let buyThisThing = {
        cost: 0,
      };

      switch (type) {
        case "struct":
          buyThisThing.cost = this.structData[index].cost;
          buyThisThing.structure = this.structData[index].type;
          break;

        case "item":
          buyThisThing.cost = this.itemData[index].cost;
          buyThisThing.item = this.itemData[index].type;
          break;
      }

      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/owner/buyItem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id, buyThisThing }),
        }
      );
      let success = await rpnse.json();
      
      console.log("Buying:", buyThisThing, "Result", success);

      if (success) {
        this.updateStore();
      }
    },
    async updateStore(){
      const rpnse = await fetch(
      `http://${window.location.hostname}:3001/owner/store/${this.userData.ownerId}`,
        {
        headers: { "Content-Type": "application/json" },
        }
      );
      const storeData = await rpnse.json();

      storeData.items.forEach(it=>{
        switch(it.slot){
          case "head":
          this.headData.push(it);
            break;
            case "body":
            this.bodyData.push(it);
            break;
            case "offHand":
            this.offData.push(it);
            break;
            case "mainHand":
            this.mainData.push(it);
            break;
            case "boots":
            this.bootsData.push(it);
            break;
        }
      })
      this.itemData = storeData.items;

      this.structData = storeData.structures;

    }
  },
  components: {
    itemCard
  },
  data() {
    return {
      userData: auth.getUser(),
      itemData: null,
      headData: [],
      bodyData: [],
      mainData: [],
      offData: [],
      bootsData: [],
      structData: null,
    };
  },
  async mounted() {
    this.updateStore();
  },
};
</script>

<style scoped></style>
