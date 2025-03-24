<template>
  <div>
    <div v-if="memoryData" class="flex text-black">
      <div class="bg-yellow-100 w-[15rem] h-[10rem] p-2">
        PREPARE
        <div v-for="prep in prepare" class="flex flex-col">
          {{ prep }}
        </div>
      </div>
      <div class="bg-pink-300 w-[15rem] h-[10rem] p-2">
        CLASH
        <div v-for="prep in clash" class="flex flex-col">
          {{ prep }}
        </div>
      </div>
      <div class="bg-yellow-100 w-[15rem] h-[10rem] p-2">
        REACT
        <div v-for="prep in react" class="flex flex-col">
          {{ prep }}
        </div>
      </div>
    </div>
    <div
      id="clashTut"
      v-else-if="skills"
      class="relative p-6 flex-auto flex text-black"
    >
      <div>
        <h1>Prepare</h1>
        <draggable
          class="list-group w-64 bg-yellow-100 h-48 m-2"
          :list="prepare"
          sort="false"
          group="prepare"
          itemKey="name"
        >
          -->
          <template #item="{ element }">
            <div class="list-group-item m-2 bg-pink-300">{{ element }}</div>
          </template>
        </draggable>
      </div>

      <div>
        <h1>Clash</h1>
        <div class="w-64 bg-yellow-100 h-48 m-2 cursor-auto">
          <template v-for="skill in clash" :key="skill">
            <ItemMouseOver :itemId="skill" type="skill" :gladData="gladData">
              <h1 class="m-1 bg-pink-300 text-center">{{ skill }}</h1>
            </ItemMouseOver>
          </template>
        </div>
      </div>

      <div>
        <h1>React</h1>

        <draggable
          class="list-group w-64 bg-yellow-100 h-48 m-2"
          :list="react"
          sort="false"
          group="react"
          itemKey="name"
        >
          <template #item="{ element }">
            <div class="list-group-item m-2 bg-pink-300">{{ element }}</div>
          </template>
        </draggable>
      </div>
    </div>

    <div v-if="skills" class="relative p-6 flex-auto flex text-black">
      <div>
        <h1>Unassigned Prepare</h1>
        <draggable
          class="list-group w-64 bg-blue-100 h-48 m-2"
          :list="unPrepare"
          sort="false"
          group="prepare"
          itemKey="name"
        >
          <template #item="{ element }">
            <div class="list-group-item m-2 bg-cyan-300">
              {{ element }}
            </div>
          </template>
        </draggable>
      </div>
      <div class="list-group w-64 h-48 m-2"></div>
      <div>
        <h1>Unassigned React</h1>
        <draggable
          class="list-group w-64 bg-blue-100 h-48 m-2"
          :list="unReact"
          sort="false"
          group="react"
          itemKey="name"
        >
          <template #item="{ element }">
            <div class="list-group-item m-2 bg-cyan-300">{{ element }}</div>
          </template>
        </draggable>
      </div>
    </div>

    <BaseFooter>
      <button
        class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        v-on:click="saveClash"
      >
        Save
      </button>
      <button
        class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        v-on:click="$emit('closeModal')"
      >
        Close
      </button>
    </BaseFooter>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";

const props = defineProps({
  gladId: {
    type: String,
    default: "",
  },
  gladData: {},
  memoryData: {},
});
const { gladId, memoryData, gladData } = toRefs(props);
const emit = defineEmits(["closeModal"]);
const apiCall = inject("apiCall");

const showTutorial = inject("showTutorial");
const skills = ref(null);
const unReact = ref(null);
const unPrepare = ref(null);
const clash = ref(null);
const prepare = ref(null);
const react = ref(null);
const toolTipMsg = ref("hi");

onMounted(async () => {
  // console.log('Clash getting memory data',gladId,memoryData);
  if (memoryData.value) {
    clash.value = memoryData.value.clash;
    prepare.value = memoryData.value.prepare;
    react.value = memoryData.value.react;
    console.log(clash.value, memoryData);
  } else if (gladId.value) {
    const rpnse = await fetch(
      apiCall.value + `/gladiator/clashInfo/${gladId.value}`,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    const gladData = await rpnse.json();
    skills.value = gladData;
    unPrepare.value = gladData.unPrepare;
    unReact.value = gladData.unReact;
    clash.value = gladData.clash;
    prepare.value = gladData.prepare;
    react.value = gladData.react;
  }
  showTutorial({
    elementId: "clashTut",
    message: "These are your clash abilities, ",
    orientation: "bottom",
  });
});

async function saveClash() {
  const clashObj = {
    react: react,
    prepare: prepare,
  };
  await fetch(apiCall.value + "/gladiator/updateClash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: gladId, save: clashObj }),
  });
  emit("closeModal");
}
</script>

<style scoped></style>
