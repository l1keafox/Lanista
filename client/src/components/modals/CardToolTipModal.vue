<template>
	<div
		id="toolTip"
		class="cursor-disabled fixed text-black bg-white z-50">
    {{ context }}
    {{  trainJson }}
  </div>
</template>

<script setup>
import { useMouse } from "@vueuse/core";
import cacheJson from "./../../composables/cacheJson";

const props = defineProps({
	context: {},
  type:{
    default:"item"
  }
});


const { context,type } = toRefs(props);
const apiCall = inject("apiCall");
const trainJson = ref()
onMounted(() => {
  console.log(context.value,type.value)
	const mouse = reactive(useMouse());

	const infoEle = document.getElementById("toolTip");
	

	async function doThis() {
		 let ditto = await cacheJson(`/assets/json/items`, apiCall.value);
     trainJson.value = ditto[context.value]
	}

	doThis();

	setTimeout(() => {
		infoEle.style.left = `${mouse.x + 15}px`;
		infoEle.style.top = `${mouse.y}px`;
	}, 75);
});
</script>

<style scoped></style>
