<template>
  <div  >
    <img :src="spritesheet" class="sprite" :style="activePosition">
  </div>
</template>

<script>
import json from './../assets/animation-data/hume2.json'
import spritesheet from './../assets/hume1.png'
import { useIntervalFn } from '@vueuse/core'
import {ref} from 'vue'
export default {
  name: 'tapp',
  data(){
    return{

    }
  },
  setup(){
    const index = ref(0)
    const activePosition = ref("")


    const { pause, resume, isActive } = useIntervalFn(() => {
      if(index.value >= 6){
        index.value = 0;        
      }
      let frame = json.find(entry=>entry.name == "walkRight"+index.value)
      if(frame)
      activePosition.value = `

        background-position-x: -${frame.x}px; 
        background-position-y: -${frame.y}px;
        width: ${frame.width}px;
        height: ${frame.height}px;
      `      
      index.value++
    }, 135)

    return {
      index,
      activePosition
    }
  },

}
</script>
<style scoped>
.sprite {
  /* display the image*/
  background: url("./../assets/hume1.png") no-repeat;
  width: 14px; 
  height: 29px;
  background-position-x: -25px ;
  background-position-y: -399px ;
}
</style>