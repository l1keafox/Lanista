<template>
  <div>
    <!--Background-->
    <div class="opacity-25 fixed inset-0 bg-black z-40"></div>

    <div class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex" data-id="bg" v-on:click="bgClose($event)">
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-3xl font-semibold">Equipment</h3>

          </div>
          <!--body-->
          <div class="relative p-6 flex-auto" v-if="gladiatorData && inventoryData">


            <div class="flex justify-between"> 
              <h2>Head :{{gladiatorData.head}}</h2> 
              <template v-if="inventoryData.head">
                <select name="head" class="bg-cyan-100 w-28" id="head"> 
                  <option value="empty">Select</option>
                  <template v-for="(item,index) in inventoryData.head" :key="index">
                  <option  :value="item.type"> {{item.type}}</option>
                  </template>
                </select>
              </template>
            </div>            

            <div class="flex justify-between"> 
              <h2>Main Hand:{{gladiatorData.mainHand}}</h2> 
              <template v-if="inventoryData.mainHand">
                <select name="mainHand" class="bg-cyan-100 w-28" id="mainHand"> 
                  <option value="empty">Select</option>
                  <template v-for="(item,index) in inventoryData.mainHand" :key="index">
                  <option  :value="item.type"> {{item.type}}</option>
                  </template>
                </select>
              </template>
            </div>

            <div class="flex justify-between"> 
              <h2>Off Hand:{{gladiatorData.offHand}}</h2> 
              <template v-if="inventoryData.offHand">
                <select name="offHand" class="bg-cyan-100 w-28" id="offHand"> 
                  <option value="empty">Select</option>
                  <template v-for="(item,index) in inventoryData.offHand" :key="index">
                  <option  :value="item.type"> {{item.type}}</option>
                  </template>
                </select>
              </template>
            </div>

            <div class="flex justify-between"> 
              <h2>Body:{{gladiatorData.body}}</h2> 
              <template v-if="inventoryData.body">
                <select name="body" class="bg-cyan-100 w-28" id="body"> 
                  <option value="empty">Select</option>
                  <template v-for="(item,index) in inventoryData.body" :key="index">
                  <option  :value="item.type"> {{item.type}}</option>
                  </template>
                </select>
              </template>
            </div>

            <div class="flex justify-between"> 
              <h2>Boots:{{gladiatorData.boots}}</h2> 
              <template v-if="inventoryData.boots">
                <select name="boots" class="bg-cyan-100 w-28" id="boots"> 
                  <option value="empty">Select</option>
                  <template v-for="(item,index) in inventoryData.boots" :key="index">
                  <option  :value="item.type" > {{item.type}}</option>
                  </template>
                </select>
              </template>
            </div>

          </div>
          <p> Equipped items are lost and cannot be unequipped</p>
          <!--footer-->
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
          >
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="$emit('closeModal')"> Close            </button>
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="doEquip"> Equip Items            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "./../mixins/auth";
export default {
  name: "EquipmentScreen",
  data(){
    return{
      userData: auth.getUser(),
      gladiatorData:null,
      inventoryData:null
    };
  },
  props: ["gladId"],
  methods: {
    bgClose(event) {
      if (event.target.getAttribute("data-id") === "bg") {
        this.$emit("closeModal");
      }
    },
    async doEquip(){
      const slots = ["head","mainHand","offHand","body","boots"];
      const equipObj = slots.map( slot =>{
        let sch = document.getElementById(slot);
        if(sch && sch.value !== 'empty'){
          return {slot,newEquip:sch.value}
        }
      }).filter( ele => {
        return ele !== undefined
      });

      if(equipObj.length){
        await fetch(
        `http://${window.location.hostname}:3001/owner/removeItems`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id, "remove":equipObj }),
          }
        );

        await fetch(
        `http://${window.location.hostname}:3001/gladiator/updateEquipment`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.gladId, "save":equipObj }),
          }
        );

      }
      this.$emit('closeModal');
    }
  },
  async mounted() {
    
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/gladiator`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.gladId }),
      }
    );
    const gladiatorData = await rpnse.json();
    this.gladiatorData = gladiatorData;

  const inventory = await fetch(
      `http://${window.location.hostname}:3001/owner/itemsSort`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.userData._id }),
      }
    );
    const inventoryData = await inventory.json();
    console.log(inventoryData);
    this.inventoryData = inventoryData;

  },
};
</script>

<style scoped></style>
