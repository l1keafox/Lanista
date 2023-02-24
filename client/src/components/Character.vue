<template>
	<canvas :id="gladName" v-bind="$attrs"></canvas>
</template>

<script setup>
import json from "../assets/animation-data/hume1.json";
import { onMounted, defineProps } from "vue";

import { useIntervalFn } from "@vueuse/core";
import AniState from "../composables/AnimateState";
import { inject } from "vue";

import createImg2 from "./../composables/AnimateFrames"
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
// console.log(createImg2);

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

	/*

		All Animation is based on the first request - which will look
		and see what frame data it needs.

	*/

	let request = ""; 
	// frameArray is what hold's the object of current animation.
	// if it is empty it will be standing.

	// Tatking the request, it should now ask for frame information

	// Looking at a JSON file, it will be frameName and frameTime in an array.
	
	//[{frameName:null, frameTime: 100, frameData:{ "name": "jumpUp2", png:"pngMap", "x": 448, "y": 64, "width": 64, "height": 64 }}]
	/*
		name is the search by frameName i guess we don't really needs this framData with it but.
		png: is the pngName to find in a map
		x/y - key info of that frame and png.
		w/h - key info
	*/

	// next taking that array above and finding the frameData 

	// we will need an second map, to point which frameName matches with png/json

	// using the json data it will find it via name, and grab that info or be able to grab it later.

	// Once it has that array filled with frameData,

	// It will start the animation, starting with the framedata finding the right png's and 
	// set the nextTimeOut or interval to be based on the frameTime. It will unshift the array and start a new timer.

	// Once animation array is cleared it will go back to standing or it can loop.
	
	function getOutfitURL(clothes) {
    if(!clothes) return createImg2(`/assets/char_a_p1/1out/char_a_p1_1out_fstr_v02.png`,apiCall.value);
		if (clothes.body) {
			// As time goes on here is where we will do equipment.
			return createImg2(`/assets/char_a_p1/1out/char_a_p1_1out_fstr_v02.png`,apiCall.value);
		} else if (clothes.sex == "m") {
			return createImg2(`/assets/char_a_p1/1out/char_a_p1_1out_boxr_v01.png`,apiCall.value);
		} else {
			return createImg2(`/assets/char_a_p1/1out/char_a_p1_1out_undi_v01.png`,apiCall.value);
		}
		return null;
	}
  function getSkinURL(clothes){

    if(!clothes || !clothes.skin) return createImg2(`/assets/char_a_p1/char_a_p1_0bas_demn_v02.png`,apiCall.value);
    return createImg2(`/assets/${clothes.skin}`,apiCall.value);
  }
  function getHairURL(clothes){
    if(!clothes || !clothes.skin) return createImg2(`/assets/char_a_p1/4har/char_a_p1_4har_dap1_v02.png`,apiCall.value);
    return createImg2(`/assets/${clothes.hair}`,apiCall.value)
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
