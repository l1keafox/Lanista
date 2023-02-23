<template>
	<canvas :id="gladName" v-bind="$attrs" ></canvas>
</template>

<script setup>
import json from "../assets/animation-data/hume1.json";
import { ref, onMounted , defineProps } from "vue";

import { useIntervalFn } from "@vueuse/core";
import AniState from "../composables/AnimateState";
import { inject } from 'vue'

const apiCall = inject('apiCall');
/* Interface 

gladName : required due to 
size : number or pixel size?
direction : String / "Up"/"Down"/"Left"/"Right"
animation : String / "run"/ "walk"
Default for now is that the character is centered.
*/

const {direction,animation,gladName} = defineProps({
  clothes:{
    type:Object
  },
  gladName:{
    type:String
  },
  direction:{
    type:String,
    default: "Down"
  },
  animation:{
    type:String,
    default: "walk"
  }
})


const State = AniState;
State.genDefaultState();

onMounted(async () => {

	const canvas = document.getElementById(gladName);
	const context = canvas.getContext("2d");
	let width = (canvas.width = 64);
	let height = (canvas.height = 64);
	let frameIndex = 0;

  function createImg(url){
    const thisImage = new Image();
        thisImage.src = apiCall.value+url;
    return thisImage;  
  }
	const bodyImage = createImg("/assets/char_a_p1/char_a_p1_0bas_humn_v10.png")
  
  // const hairImage = new Image();
  //       hairImage.src = hairSheet;
  // const underImage = new Image();
  //       underImage.src = underSheet;
  //,hairImage,underImage
  const imageArray = [bodyImage];


	function animate(state) {
		const frameInfo = json.find(
			(entry) => entry.name == state.indexName + state.animationArray[frameIndex]
		);
    if(!frameInfo){
      console.log(frameIndex,state );
    } else {
      imageArray.forEach(Image =>{
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
      });
    }
    
		frameIndex++;
		if (frameIndex >= State.getState(animation,direction).animationArray.length) {
			frameIndex = 0;
		}
	}
  const { pause, resume, isActive } = useIntervalFn(() => {
    context.clearRect(0, 0, width, height);
  	animate( State.getState(animation,direction) );
  },135);

});
</script>

top:-32px;
left:-32px;

<style scoped>
canvas {
	display: block;
  position: absolute;
}

#characterWrap{
  position:absolute;
}
</style>
