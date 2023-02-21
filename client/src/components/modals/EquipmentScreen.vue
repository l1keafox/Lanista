<template>
  <BaseModal>
    <template v-slot:header>
      <h3 class="text-3xl font-semibold">Equipment</h3>
    </template>

    <template v-slot:content>
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

    </template>

    <template v-slot:footer>
      <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="doEquip"> Equip Items            </button>

    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "./BaseModal.vue"
import auth from "./../../mixins/auth";
export default {
  name: "EquipmentScreen",
  components:{
    BaseModal
  },
  data(){
    return{
      userData: auth.getUser(),
      gladiatorData:null,
      inventoryData:null
    };
  },
  props: ["gladId"],
  inject:['apiCall'],
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
          this.apiCall.value+ `/owner/removeItems`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": this.userData._id, "remove":equipObj }),
          }
        );

        await fetch(
          this.apiCall.value+ `/gladiator/updateEquipment`,
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
      this.apiCall.value+ `/gladiator/${this.gladId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    this.gladiatorData = await rpnse.json();

  const inventory = await fetch(
    this.apiCall.value+ `/owner/itemsSort/${this.userData.ownerId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    this.inventoryData = await inventory.json();
  },
};

</script>

<style scoped>

</style>