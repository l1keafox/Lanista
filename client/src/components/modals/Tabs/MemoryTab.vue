<template>
	<div>
		<div class="relative p-6 flex-auto  overflow-y-auto bg-yellow-200">
        <template v-for="(memory,index) in memories"
        :key="index">
        <div class="flex justify-between">
            <div class="flex justify-between"> Age:{{memory.age}}  Lvl:{{memory.level}} Record:{{memory.winRecord}}/{{memory.lossRecord}} Tournament:{{ memory.weekWin }}/{{ memory.monthWin }}/{{ memory.quarterWin }}/{{ memory.yearWin }} </div> <button class="bg-blue-300 text-black" :data-index="index" @click="showMemory($event)"> See Memory </button>
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

    <GladiatorStats @closeModal="closeModal" :gladMemory="Memory"  v-if="isModalShown" />

	</div>
</template>

<script setup>
import BaseFooter from "../BaseFooter.vue";
import GladiatorStats from "./../GladiatorStats.vue";
import { onMounted, defineProps, inject, ref, defineEmits } from "vue";
const { gladId } = defineProps({
	gladId: {
	},
});

const apiCall = inject("apiCall");
const isModalShown = ref(false);

const count = ref(0);
const memories = ref([]);
const Memory = ref(null);

onMounted(() => {
	let observer = new IntersectionObserver(() => {
		loadMorePosts();
	});
	observer.observe(document.getElementById("intersection"));
});
async function showMemory(event) {
	Memory.value = memories[event.target.getAttribute("data-index")];
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
