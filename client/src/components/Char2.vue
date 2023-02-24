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
	animation: { // this needs to be na v-modal.
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

	let request = animation; 

  let nextFrameArray = [];
  let doFrameArray = [];
	// nextFrameArray is what hold's the object of current animation.
  // we will need our own intervals for animation.

	const { pause, resume, isActive } = useIntervalFn(() => {


      // We will add in an request to nextFrameArray
      // Here we will emit back to the parent who is making this animation request to empty the request letter.
    if(animation){
      nextFrameArray.push(animation)
      
    }

    function goGetFrameInfo(research){

    }

    if(nextFrameArray.length == 0){
      // if it is empty it will be standing.

    } else {
      // we have something in the array
      const research = nextFrameArray[0];
      	// Taking the request, it should now ask for frame information
	      // Looking at a JSON file, it will be frameName and frameTime in an array.
        doFrameArray = goGetFrameInfo(research);
	      // doFrameArray = [{frameName:null, frameTime: 100}]
        // doFrameArray.push

	      // next taking that array above and finding the frameData 

	      // we will need an objectMap, to point which frameName matches with png/json
        // This objectMap will take frameName and return png and decodeJson locations.

        // frameData:{ "anime": "jumpUp2", png:"pngMap", "x": 448, "y": 64, "width": 64, "height": 64 }

        // decodeJson, you will grab x/y/width/height

        	/*
	        	name is the search by frameName i guess we don't really needs this framData with it but.
	        	png: is the pngName to find in a map
	        	x/y - key info of that frame and png.
          		w/h - key info
	        */

	    // next taking that decodeJson above and finding the frameData 

      //doFrameArray =[{frameName:null, frameTime: 100, frameData:{"anime": "jumpUp2",json:"jsonKey", png:"pngKey", "x": 448, "y": 64, "width": 64, "height": 64 }}]

      // Now that should be looking rlike above.
    	// we will need an objectMap, to point which frameName matches with png/json and return acutal path.



      	// Once it has that array filled with doFrameArray,
        // It will count how much time has passed 
        // once it gets above doFrameArray[0].frameTime

        // #### HERE IS WHERE YOU WILL WANT TO CODE NEXT STUFF ####

          // This is when you shift() doFrameArray to get rid of the 0 posistion.
          // reset the count
          // Do an new animate
          // so frameIndex
          // frameIndex++;
		      // if ( frameIndex >= State.getState(animation, direction).animationArray.length) {
			    //   frameIndex = 0;
      		// }

          // cause in frameInfo in animate it's looking for 
          // entry.name == state.indexName + state.animationArray[frameIndex]

          context.clearRect(0, 0, width, height);
      		animate(State.getState(animation, direction),doFrameArray[0].frameData );

      	// Once animation array is cleared it will go back to standing or it can loop?


    }


	}, 135);


	


	




	
  


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


  // This is the array of which the canvas will be painted via image.
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

	function animate(state, frameInfo) {
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
