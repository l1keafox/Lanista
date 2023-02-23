<template>
  <div class="w-full overflow-x-hidden">

    <div v-if="structData"  class="flex overflow-x-auto ">
      <template v-for="(struct, index) in structData" :key="index">
        <itemCard :data="struct" @buyThing="buyThing('structData',index)"/>
      </template>
    </div>
    <hr/>
    <div v-if="headData" class="flex overflow-x-auto ">
      <template v-for="(item, index) in headData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('headData',index)"/>
      </template>
    </div>
    <hr />
    <div v-if="bodyData" class="flex overflow-x-auto">
      <template v-for="(item, index) in bodyData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('bodyData',index)"/>
      </template>
    </div>
    <hr />
    <div v-if="mainData" class="flex  overflow-x-auto  ">
      <template v-for="(item, index) in mainData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('mainData',index)"/>
      </template>
    </div>
    <hr />
    <div v-if="offData" class="flex overflow-x-auto ">
      <template v-for="(item, index) in offData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('offData',index)"/>
      </template>
    </div>
    <hr />
    <div v-if="bootsData" class="flex overflow-x-auto ">
      <template v-for="(item, index) in bootsData" :key="index" >
        <itemCard :data="item" @buyThing="buyThing('bootsData',index)"/>
      </template>
    </div>
    <hr />
  </div>
</template>

<script>
import auth from "./../mixins/auth";
import itemCard from "./../components/ItemCard.vue"
export default {
  inject: ["card", "cardTitle","smallCard",'apiCall'],
  name: "StoreMain",
  methods: {
    async buyThing(type, index) {
      
      let buyThisThing = this[type][index]

      const rpnse = await fetch(
        this.apiCall.value +
        `/owner/buyItem`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.userData._id, buyThisThing }),
        }
      );
      let success = await rpnse.json();
      
      console.log("Buying:", buyThisThing, "Result", success);
      if (success) {
        alert("Bought Item");
        this.updateStore();
      } else {
        console.log("Not enough gold")
      }
    },
    async updateStore(){
      const rpnse = await fetch(
        this.apiCall.value +
      `/owner/store/${this.userData.ownerId}`,
        {
        headers: { "Content-Type": "application/json" },
        }
      );
      const storeData = await rpnse.json();
      this.headData= [];
      this.bodyData= [];
      this.offData= [];
      this.mainData= [];
      this.bootsData= [];
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
