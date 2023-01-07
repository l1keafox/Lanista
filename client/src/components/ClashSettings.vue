<template>
  <div>
    <!--Background-->
    <div class="opacity-25 fixed inset-0 bg-black z-40"></div>

    <div
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
      data-id="bg"
      v-on:click="bgClose($event)"
    >
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-3xl font-semibold">Clash Setup</h3>
          </div>
          <!--body-->
          <div v-if="skills" class="relative p-6 flex-auto flex">
            <!-- <div class="w-64 bg-yellow-100 h-48 m-2"> Prepare </div>
            <div class="w-64 bg-yellow-100 h-48 m-2"> Clash </div>
            <div class="w-64 bg-yellow-100 h-48 m-2"> React </div> -->

            <draggable
              class="list-group w-64 bg-yellow-100 h-48 m-2"
              :list="prepare"
              sort="false"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element }} {{ index }}</div>
              </template>
            </draggable>
            <draggable
              class="list-group w-64 bg-yellow-100 h-48 m-2"
              :list="clash"
              sort="false"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element }} {{ index }}</div>
              </template>
            </draggable>

            <draggable
              class="list-group w-64 bg-yellow-100 h-48 m-2"
              :list="react"
              sort="false"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element }} {{ index }}</div>
              </template>
            </draggable>

            <draggable
              class="list-group w-64 bg-yellow-100 h-48 m-2"
              :list="unassigned"
              sort="false"
              group="people"
              @change="log"
              itemKey="name"
            >
              <template #item="{ element, index }">
                <div class="list-group-item">{{ element }} {{ index }}</div>
              </template>
            </draggable>
            
          </div>
          <!--footer-->
          <div
            class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
          >
            <button
              class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              v-on:click="$emit('closeModal')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "ClashSetting",
  props: ["gladId"],
  components: {
    draggable,
  },

  data() {
    return {
      skills: null,
      unassigned: null,
      clash: null,
      prepare: null,
      react: null,
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 },
      ],
    };
  },
  methods: {
    bgClose(event) {
      if (event.target.getAttribute("data-id") === "bg") {
        this.$emit("closeModal");
      }
    },
    log: function (evt) {
      window.console.log(evt);
      // access updated DOM
      console.log(this.list1);
      console.log(this.list2);
    },
  },
  async mounted() {
    const rpnse = await fetch(
      `http://${window.location.hostname}:3001/gladiator/clashInfo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id": this.gladId }),
      }
    );

    const gladData = await rpnse.json();
    this.skills = gladData;
    this.unassigned = gladData.unassigned;
    this.clash = gladData.clash;
    this.prepare = gladData.prepare;
    this.react = gladData.react;
    console.log(gladData);
  },
};
</script>

<style scoped></style>
