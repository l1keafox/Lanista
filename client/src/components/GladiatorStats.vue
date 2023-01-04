<template>
    <div>
      <div
        class="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
        id="modal"
      >
        <div role="alert" class="container mx-auto w-11/12 md:w-2/3 max-w-lg">
          <div
            class="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400"
          >
            <div
              class="flex flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] items-center justify-center"
            >
              <div class="mb-8 flex justify-center flex flex-col">
                <div v-if="gladiatorData">
                  <h1>{{ gladiatorData.name }}</h1>
                  <h2>hits:{{gladiatorData.hits}}/mana:{{gladiatorData.mana}} </h2>
                  
                  <h2>morale:{{gladiatorData.morale}}/stress:{{gladiatorData.stress}} </h2>
                  <h2>strength:{{gladiatorData.strength}} | dexterity:{{gladiatorData.dexterity}} </h2>
                  <h2>agility:{{gladiatorData.agility}} consitution:{{gladiatorData.consitution}}  </h2>
                  <h2>vitality:{{gladiatorData.vitality}} </h2>
          
                  <h2>intelligence:{{gladiatorData.intelligence}} wisdom:{{gladiatorData.wisdom}} </h2>
                  <h2>bravery:{{gladiatorData.bravery}} piety:{{gladiatorData.piety}} </h2>
                  <h2>sensitivity:{{gladiatorData.sensitivity}} luck:{{gladiatorData.luck}} </h2>
                  <h2>reputation:{{gladiatorData.reputation}}  charisma:{{gladiatorData.charisma}} </h2>
          
                <button class="bg-slate-200" @click="$emit('closeStats')">
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "GladiatorStats",
    props: ["gladId"],
    data() {
      return {
        gladiatorData: null,
      };
    },
    methods:{
    
    },
    async mounted() {
      console.log(this.gladId);
      const rpnse = await fetch(
        `http://${window.location.hostname}:3001/gladiator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "id": this.gladId }),
        }
      );
      const ownerData = await rpnse.json();
      this.gladiatorData = ownerData;
    },
  };
  </script>
  
  <style scoped></style>
  