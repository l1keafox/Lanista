<template>
	<canvas :id="gladName" v-bind="$attrs"></canvas>
</template>

<script setup>
import keyMapJson from "../assets/animation-data/p1.json";
import { onMounted, defineProps } from "vue";

import { useIntervalFn } from "@vueuse/core";
import AniState from "../composables/AnimateState";
import { inject } from "vue";
import keyFrames from "./../assets/animation-data/AnimeKeyframes.json";
import createImg2 from "./../composables/AnimateFrames";
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
		default: "123",
	},
	direction: {
		type: String,
	},
	animation: {
		// this needs to be na v-modal.
		type: String,
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

	let request = animation;

	let nextInFrame = [];
	let keyFrameArray = [];
	// nextInFrame is what hold's the object of current animation.
	// we will need our own intervals for animation.
	let timePassed = 0;
	let startOfTick = new Date();

	// We will add in an request to nextInFrame
	// Here we will emit back to the parent who is making this animation request to empty the request letter.
	if (animation && nextInFrame.length == 0) {
		nextInFrame.push({ animation, direction });
	}

	function goGetFrameInfo(research) {
		let { direction, animation } = research;
		direction = direction.toLowerCase();
		direction =
			direction.toLowerCase().charAt(0).toUpperCase() + direction.slice(1);
		return Array.from(keyFrames[animation][direction]);
	}

	function addNextFrame(){
		//
		//			Here we create newKeyFrames to add on to keyFrameArray
		//
		const research = nextInFrame[0];
		let newKeyFrames = goGetFrameInfo(research, nextInFrame);
		// Taking the request, it should now ask for frame information
		// Looking at a JSON file, it will be frameName and frameTime in an array.
		// newKeyFrames = goGetFrameInfo(research);
		// newKeyFrames = [{frameName:null, frameTime: 100}]
		// keyFrameArray.push

		// next taking that array above and finding the frameData

		// we will need an objectMap, to point which frameName matches with png/json
		// This objectMap will take frameName and return png and decodeJson locations.

		// frameData:{ "anime": "jumpUp2", png:"pngMap", "x": 448, "y": 64, "width": 64, "height": 64 }

		// decodeJson, you will grab x/y/width/height
		newKeyFrames = newKeyFrames.map((keyFrame) => {
			// here we now look for frame Data from JSON
			// Here we need to look at the key to determine what keyMapJson it should be using.
			switch(keyFrame.key){
				case "p1":
					keyFrame.frameData = keyMapJson[keyFrame.fNm];
					return keyFrame;
				default:
					keyFrame.frameData = keyMapJson[keyFrame.fNm];
				return keyFrame;
			}
		});

		// next taking that decodeJson above and finding the frameData

		//newKeyFrames =[{frameName:null, frameTime: 100, frameData:{"anime": "jumpUp2",json:"jsonKey", png:"pngKey", "x": 448, "y": 64, "width": 64, "height": 64 }}]
		// console.log(' AFter ',newKeyFrames);

		if (keyFrameArray.length < 20)
			keyFrameArray = keyFrameArray.concat(newKeyFrames);

		
		// Now that should be looking rlike above.

		/*
	        	fNm = frameName,
						fTm : frameTime,
						key : json/png key
						frameData:{
							x:
							y:
							width:
							height:
						}
	        */

		// From here on we work on keyFrameArray;
	}

	if (nextInFrame.length == 0) {
		// if it is empty it will be standing.
	} else {
		addNextFrame();
	}

	function getOutfitURL(clothes,key) {
		// if (!clothes)
		// 	return createImg2(
		// 		`/assets/char_a_${key}/1out/char_a_${key}_1out_fstr_v02.png`,
		// 		apiCall.value
		// 	);
		// if (clothes.body) {
		// 	// As time goes on here is where we will do equipment.
		// 	return createImg2(
		// 		`/assets/char_a_${key}/1out/char_a_${key}_1out_fstr_v02.png`,
		// 		apiCall.value
		// 	);
		// } else 
		if (clothes && clothes.sex == "m") {
			return createImg2(
				`/assets/char_a_${key}/1out/char_a_${key}_1out_boxr_v01.png`,
				apiCall.value
			);
		} else {
			return createImg2(
				`/assets/char_a_${key}/1out/char_a_${key}_1out_undi_v01.png`,
				apiCall.value
			);
		}
		return null;
	}

	function getSkinURL(clothes,key) {
		if (!clothes || !clothes.skin)
			return createImg2(
				`/assets/char_a_p1/char_a_p1_0bas_demn_v02.png`,
				apiCall.value
			);
//  return `char_a_p1/char_a_p1_0bas_humn_v${rando}.png`;			
			return createImg2(`/assets/char_a_${key}/char_a_${key}_0bas_${clothes.skin}`, apiCall.value);
		}
	function getHairURL(clothes,key) {
		if (!clothes || !clothes.skin)
			return createImg2(
				`/assets/char_a_p1/4har/char_a_p1_4har_dap1_v02.png`,
				apiCall.value
			);
		//return `${type}_v${version}.png`;
		return createImg2(`/assets/char_a_${key}/4har/char_a_${key}_4har_${clothes.hair}`, apiCall.value);
	}

	// This is the array of which the canvas will be painted via image.
	// console.log('Doing imag eneed key?',keyFrameArray[0].key)
	const imageArray = [
		getSkinURL(clothes,keyFrameArray[0].key), //		skinLayer, 0bot (sub-layer, fully behind the character sprite)
		getOutfitURL(clothes,keyFrameArray[0].key), //   createImg(`/assets/${clothes.skin}`); // 1out (outfit, lowest layer)
		null, //   createImg(`/assets/${clothes.skin}`); // 2clo (cloaks, capes, and mantles)
		null, //   createImg(`/assets/${clothes.skin}`); // 3fac (face items, like glasses and masks)
		getHairURL(clothes,keyFrameArray[0].key), //4har (hair)
		null, //   createImg(`/assets/${clothes.skin}`); //5hat (hats and hoods)
		null, //   createImg(`/assets/${clothes.skin}`); //6tla (primary tool layer, weapons and such)
		null, //   createImg(`/assets/${clothes.skin}`); //7tlb (secondary tool layer, shields and off-hand weapons, highest layer)
	];

	// console.log(keyFrameArray[0].fTm, "Doing first animate");

		animate(keyFrameArray[0].frameData);
		setTimeout(doNextFrame,keyFrameArray[0].fTm);

	function doNextFrame() {
			keyFrameArray.shift();
	// here we should o an setTimeout

		// we will need an objectMap, to point which frameName matches with png/json and return acutal path.
		// const keyMap = {
		// 	"p1":{ json:keyMapJson, png: }
		// }
		// I think the key should be enough later on to grab ... just the png

		// Once the newKeyFrames is done,
		// concat it with keyFrameArray;

		// Once it has that array filled with keyFrameArray,
		// It will count how much time has passed
		// once it gets above keyFrameArray[0].frameTime

		// #### HERE IS WHERE YOU WILL WANT TO CODE NEXT STUFF ####

		// This is when you shift() keyFrameArray to get rid of the 0 posistion.
		
		context.clearRect(0, 0, width, height);
		if(keyFrameArray[0]){
			animate(keyFrameArray[0].frameData);
			setTimeout(doNextFrame,keyFrameArray[0].fTm);
		} else {
			addNextFrame()
			animate(keyFrameArray[0].frameData);
			setTimeout(doNextFrame,keyFrameArray[0].fTm);
		}

		// Once animation array is cleared it will go back to standing or it can loop?
	}

	function animate(frameInfo) {
		if (!frameInfo) {
			console.log("  -Char> ERROR ", frameIndex);
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
	}
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
