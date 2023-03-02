<template>
	<div>
		<div id="memoryTut" class="relative p-6 flex-auto  overflow-y-auto bg-yellow-200 h-[10rem]">
        <template v-for="(memory,index) in memories"
        :key="index">
        <div class="flex justify-between">
            <div class="flex justify-between text-black"> Age:{{memory.age}}  Lvl:{{memory.level}} Record:{{memory.winRecord}}/{{memory.lossRecord}} Tournament:{{ memory.weekWin }}/{{ memory.monthWin }}/{{ memory.quarterWin }}/{{ memory.yearWin }} </div> 
						<button class="bg-blue-300 text-black px-1 border border-black" :data-index="memory._id" @click="showMemory($event)"> Memory </button>
        </div>
        </template>
        <div id="intersection"> </div>


      </div>

		<BaseFooter>
			<button
				class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
				type="button"
				v-on:click="$emit('closeModal')">
				Close
			</button>
		</BaseFooter>
		<div v-if="isModalShown">
    	<GladiatorDetails @closeModal="isModalShown=false" :gladMemory="Memory" :memoryId="MemId" />
		</div>

	</div>
</template>

<script setup>
import BaseFooter from "../BaseFooter.vue";
import GladiatorDetails from "./../GladiatorDetails.vue";
import { onMounted, defineProps, inject, ref, defineEmits } from "vue";
const { gladId } = defineProps({
	gladId: {
	},
});

const apiCall = inject("apiCall");
const showTutorial = inject("showTutorial");

const isModalShown = ref(false);

const count = ref(0);
const memories = ref([]);
const Memory = ref(null);
const MemId = ref();
onMounted(() => {
	let observer = new IntersectionObserver(() => {
		console.log("BOVSER?");
		loadMorePosts();
	});
	observer.observe(document.getElementById("intersection"));
	showTutorial({
				elementId: "memoryTut",
				message: "Memories are old version of your gladiator that are saved to fight other gladiators of the same age.",
				orientation: "bottom",
			});

});
async function showMemory(event) {
	let Memory2 = memories.value.find(ele=>ele._id == event.target.getAttribute("data-index"));
	if(Memory2){
		Memory.value = Memory2;
	}
	MemId.value = event.target.getAttribute("data-index");
	console.log("SHOW:",event.target.getAttribute("data-index"),Memory.value,MemId.value)
	isModalShown.value = true;
}
async function loadMorePosts() {
	const addPosts = 10;
	const rpnse = await fetch(
		apiCall.value +
			`/gladiator/someMemories/${gladId}/${count.value}/${addPosts}`,
		{ headers: { "Content-Type": "application/json" } }
	);
	let rn = await rpnse.json();
	count.value += addPosts;
	memories.value.push(...rn);
}
function closeModal() {
	isModalShown.value = false;
}
</script>

<style scoped></style>
