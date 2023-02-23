<template>
	<canvas :id="gladName" v-bind="$attrs"></canvas>
</template>

<script setup>
import json from "../assets/animation-data/hume1.json";
import { onMounted, defineProps } from "vue";

import { useIntervalFn } from "@vueuse/core";
import AniState from "../composables/AnimateState";
import { inject } from "vue";

const apiCall = inject("apiCall");
/* Interface 

gladName : required due to 
size : number or pixel size?
direction : String / "Up"/"Down"/"Left"/"Right"
animation : String / "run"/ "walk"
clothes: {
  hair,
  skin,
  sex
}
Default for now is that the character is centered.
*/

const { direction, animation, gladName, clothes } = defineProps({
	clothes: {
		type: Object,
	},
	gladName: {
		type: String,
	},
	direction: {
		type: String,
		default: "Down",
	},
	animation: {
		type: String,
		default: "walk",
	},
});

const State = AniState;
State.genDefaultState();

onMounted(async () => {
	const canvas = document.getElementById(gladName);
	const context = canvas.getContext("2d");
	let width = (canvas.width = 64);
	let height = (canvas.height = 64);
	let frameIndex = 0;

	function createImg(url) {
		const thisImage = new Image();
		thisImage.src = apiCall.value + url;
		return thisImage;
	}

	function getOutfitURL(clothes) {
    if(!clothes) return createImg(`/assets/char_a_p1/1out/char_a_p1_1out_fstr_v02.png`);
		if (clothes.body) {
			// As time goes on here is where we will do equipment.
			return createImg(`/assets/char_a_p1/1out/char_a_p1_1out_fstr_v02.png`);
		} else if (clothes.sex == "m") {
			return createImg(`/assets/char_a_p1/1out/char_a_p1_1out_boxr_v01.png`);
		} else {
			return createImg(`/assets/char_a_p1/1out/char_a_p1_1out_undi_v01.png`);
		}
		return null;
	}
  function getSkinURL(clothes){
    if(!clothes || !clothes.skin) return createImg(`/assets/char_a_p1/char_a_p1_0bas_demn_v02.png`);
    return createImg(`/assets/${clothes.skin}`);
  }
  function getHairURL(clothes){
    if(!clothes || !clothes.skin) return createImg(`/assets/char_a_p1/4har/char_a_p1_4har_dap1_v02.png`);
    return createImg(`/assets/${clothes.hair}`)
  }

	const imageArray = [
    getSkinURL(clothes), //		skinLayer, 0bot (sub-layer, fully behind the character sprite)
		getOutfitURL(clothes), //   createImg(`/assets/${clothes.skin}`); // 1out (outfit, lowest layer)
		null, //   createImg(`/assets/${clothes.skin}`); // 2clo (cloaks, capes, and mantles)
		null, //   createImg(`/assets/${clothes.skin}`); // 3fac (face items, like glasses and masks)
		getHairURL(clothes), //4har (hair)
		null, //   createImg(`/assets/${clothes.skin}`); //5hat (hats and hoods)
		null, //   createImg(`/assets/${clothes.skin}`); //6tla (primary tool layer, weapons and such)
		null, //   createImg(`/assets/${clothes.skin}`); //7tlb (secondary tool layer, shields and off-hand weapons, highest layer)
	];

	function animate(state) {
		const frameInfo = json.find(
			(entry) =>
				entry.name == state.indexName + state.animationArray[frameIndex]
		);
		if (!frameInfo) {
			console.log("  -Char> ERROR ", frameIndex, state.indexName, state);
		} else {
			imageArray.forEach((Image) => {
				if (Image) {
					context.drawImage(
						Image,
						frameInfo.x, // Source X
						frameInfo.y, // Source Y
						frameInfo.width, // Source Wdith
						frameInfo.height, // Source height
						0, // Placement X
						0, // PlaceMent Y
						frameInfo.height, // placement height
						frameInfo.height // placement width
					);
				}
			});
		}

		frameIndex++;
		if ( frameIndex >= State.getState(animation, direction).animationArray.length) {
			frameIndex = 0;
		}
	}

	const { pause, resume, isActive } = useIntervalFn(() => {
		context.clearRect(0, 0, width, height);
		animate(State.getState(animation, direction));
	}, 135);
});
</script>

top:-32px; left:-32px;

<style scoped>
canvas {
	display: block;
	position: absolute;
}

#characterWrap {
	position: absolute;
}
</style>
