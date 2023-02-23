<template>
	<div>
		<img :src="helmSheet" class="helm absolute" :style="activePosition" />
		<img :src="bodySheet" class="body absolute" :style="activePosition" />
		<img :src="spritesheet" class="sprite" :style="activePosition" />
	</div>
</template>

<script setup>
import json from "./../assets/animation-data/hume2.json";

import spritesheet from "./../assets/char_a_p1/char_a_p1_0bas_humn_v00.png";
import helmSheet from "./../assets/char_a_p1/4har/char_a_p1_4har_bob1_v01.png";
import bodySheet from "./../assets/body1.png";

import { useIntervalFn } from "@vueuse/core";
import { ref } from "vue";

const index = ref(0);
const activePosition = ref("");
const frame = ref();
const { pause, resume, isActive } = useIntervalFn(() => {
	if (index.value >= 6) {
		index.value = 0;
	}
	frame.value = json.find((entry) => entry.name == "walkLeft" + index.value);
  //        background-image: url(${spritesheet}) no-repeat;

	activePosition.value = `
        background-position-x: -${frame.value.x}px; 
        background-position-y: -${frame.value.y}px;
        width: ${frame.value.width}px;
        height: ${frame.value.height}px;
      `;
	index.value++;
}, 135);
</script>
<style scoped>
.sprite {
	/* display the image*/
	background: url("./../assets/char_a_p1/char_a_p1_0bas_humn_v00.png") no-repeat;
	width: 14px;
	height: 29px;
	background-position-x: -25px;
	background-position-y: -399px;
}
.helm {
	/* display the image*/
	background: url("./../assets/char_a_p1/4har/char_a_p1_4har_bob1_v01.png") no-repeat;
	width: 14px;
	height: 29px;
	background-position-x: -25px;
	background-position-y: -399px;
}
.body {
	/* display the image*/
	background: url("./../assets/body1.png") no-repeat;
	width: 14px;
	height: 29px;
	background-position-x: -25px;
	background-position-y: -399px;
}
</style>
