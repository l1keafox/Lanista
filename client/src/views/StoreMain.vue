<template>
  <div class="flex h-full flex-col">
    <div class="bg-slate-900">Store</div>
    <hr />
    <h1>ITEMS:</h1>
    <div v-if="itemData">
      <div v-for="(item, index) in itemData" :key="item" :class="card">
        <h1 :class="cardTitle">{{ item.type }}</h1>
        <hr />

        <button
          class="bg-yellow-200 m-2 text-purple-900"
          @click="buyThing('item', index)"
        >
          Buy
        </button>
      </div>
    </div>

    <hr />
    <h1>Structures:</h1>
    <div v-if="structData">
      <div v-for="(struct, index) in structData" :key="struct" :class="card">
        <h1 :class="cardTitle">{{ struct.type }}</h1>
        <hr />

        <button
          class="bg-yellow-200 m-2 text-purple-900"
          @click="buyThing('struct', index)"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
  inject: ["card", "cardTitle"],
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
      }
    },
  },
  components: {},
  data() {
    return {
      userData: auth.getUser(),
      itemData: null,
      structData: null,
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
};
</script>

<style scoped></style>
