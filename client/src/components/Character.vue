<template>
	<canvas :id="gladName" v-bind="$attrs"></canvas>
</template>

<script setup>
import p1JsonMap from "../assets/animationData/p1.json";
import p2JsonMap from "../assets/animationData/p2.json";
import p4JsonMap from "../assets/animationData/p4.json";

import keyFrames from "./../assets/animationData/AnimeKeyframes.json";

import pONE2JsonMap from "../assets/animationData/pONE2.json";
import pONE1JsonMap from "../assets/animationData/pONE1.json";
import pONE3JsonMap from "../assets/animationData/pONE3.json";

import doSpriteLayer from "./../composables/doSpriteLayer"

const apiCall = inject("apiCall");
const emit = defineEmits(['update:model_value'])
/* Interface 

gladName : required due to element id
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
// console.log(createImg);

const props = defineProps({
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
	model_value:{
		type:Array,
		default:[]
	}
	
});

const { direction, animation,model_value } = toRefs(props);
const gladName = props.gladName;
const clothes = props.clothes;
let timeOut;
onUnmounted(async()=>{
	clearTimeout(timeOut)
})
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
		let strDirection = direction.value.toLowerCase();
		strDirection =
			strDirection.toLowerCase().charAt(0).toUpperCase() +
			strDirection.slice(1);
			if(!keyFrames[animation.value]){
				//console.log(animation.value, strDirection,"ERRTS",keyFrames.stand.Down)
				return keyFrames.stand.Down
			}

		return Array.from(keyFrames[animation.value][strDirection]);
	}

	function addNextFrame() {
		//
		//			Here we create newKeyFrames to add on to keyFrameArray
		//
		//const research = nextInFrame[0];
//		console.log(nextInFrame[0].animation, nextInFrame[0].direction);
		nextInFrame.forEach(inFrame=>{
			let newKeyFrames = goGetFrameInfo(inFrame, nextInFrame);
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
			// Here we need to look at the key to determine what p1JsonMap it should be using.
			switch (keyFrame.key) {
				case "pONE1":
					keyFrame.frameData = pONE1JsonMap[keyFrame.fNm];
					return keyFrame;
					case "pONE2":
						
					keyFrame.frameData = pONE2JsonMap[keyFrame.fNm];
					return keyFrame;
					case "pONE3":
					keyFrame.frameData = pONE3JsonMap[keyFrame.fNm];
					return keyFrame;

					case "p1":
					keyFrame.frameData = p1JsonMap[keyFrame.fNm];
					return keyFrame;
					case "p2":
					keyFrame.frameData = p2JsonMap[keyFrame.fNm];
					return keyFrame;
					case "p4":
					keyFrame.frameData = p4JsonMap[keyFrame.fNm];
					return keyFrame;
				default:
					keyFrame.frameData = p1JsonMap[keyFrame.fNm];
					return keyFrame;
			}
		});

		// next taking that decodeJson above and finding the frameData

		//newKeyFrames =[{frameName:null, frameTime: 100, frameData:{"anime": "jumpUp2",json:"jsonKey", png:"pngKey", "x": 448, "y": 64, "width": 64, "height": 64 }}]

			keyFrameArray = keyFrameArray.concat(newKeyFrames);

		})

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


	// console.log(keyFrameArray[0].fTm, "Doing first animate");
	animate(keyFrameArray[0].frameData);

	function animate(frameInfo) {
		
		const imageArray = doSpriteLayer(clothes,keyFrameArray[0].key,apiCall.value);

		if (!frameInfo) {
			console.log("  -Char> ERROR ", frameIndex,keyFrameArray[0]);
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

	timeOut =	setTimeout(doNextFrame, keyFrameArray[0].fTm);

	function doNextFrame() {
		// if(model_value){
		// 	console.log(model_value)
		// 	if(model_value.value.length > 0){
		// 		console.log(model_value.value[0],"MODVAL")
		// 	}
		// 	// const emit = defineEmits(['update:model_value'])		
		// }

		//  if (gladName == "Minor Belia")
		// 	console.log(
		// 		gladName,
		// 		"Doing imag eneed key?",
		// 		keyFrameArray[0],
		// 		keyFrameArray.length
		// 	);
		keyFrameArray.shift();
		// here we should o an setTimeout

		// we will need an objectMap, to point which frameName matches with png/json and return acutal path.
		// const keyMap = {
		// 	"p1":{ json:p1JsonMap, png: }
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
		if (keyFrameArray[0]) {
			animate(keyFrameArray[0].frameData);
			timeOut =	setTimeout(doNextFrame, keyFrameArray[0].fTm);
		} else {
			addNextFrame();
			animate(keyFrameArray[0].frameData);
			timeOut =	setTimeout(doNextFrame, keyFrameArray[0].fTm);
		}

		// Once animation array is cleared it will go back to standing or it can loop?
	}

});
</script>

top:-32px; left:-32px;

<style scoped>
canvas {
	display: block;

}

#characterWrap {
	position: absolute;
}
</style>
