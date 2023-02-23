<template>
  <div  >
    <img :src="spritesheet" class="sprite" :style="activePosition">
  </div>
</template>

<script>
import json from './../assets/animation-data/hume1.json'
import spritesheet from './../assets/hume1.png'
import { useIntervalFn } from '@vueuse/core'
import {ref} from 'vue'
export default {
  name: 'tapp',
  data(){
    return{
      frame:null,
      index: 0,
      activePosition: 0,
      spritesheet
    }
  },
  setup(){
    const index = ref(0)
    const activePosition = ref("")
    const { pause, resume, isActive } = useIntervalFn(() => {
      index.value++;
       console.log(index.value)
       //,json[this.index]
       let frame = json[index.value];
       activePosition.value = `
        background-position-x: -${frame.x}px; 
        background-position-y: -${frame.y}px;
        width: ${frame.width}px;
        height: ${frame.height}px;
      `        
    }, 250)

    return {
      index,
      activePosition
    }
  },
  mounted(){
    // setInterval(() => {
    //   this.index++;
    //   console.log(this.index,json[this.index])
    //   this.activePosition = `
    //     background-position-x: -${this.frame.x}px; 
    //     background-position-y: -${this.frame.y}px;
    //     width: ${this.frame.width}px;
    //     height: ${this.frame.height}px;
    //   ` 
    // }, 1000);
    this.frame = json[this.index];
    this.activePosition = `
    background-position-x: -${this.frame.x}px; 
    background-position-y: -${this.frame.y}px;
    width: ${this.frame.width}px;
    height: ${this.frame.height}px;
    ` 
  },
}
</script>
<style scoped>
.sprite {
  /* display the image*/
  background: url("./../assets/hume1.png") no-repeat;

  /* each frame is 75px wide so limit container to display one at a time */
  width: 16px; 

  /* main is roughly 150px tall */
  height: 32px;

  /* the image has some space on top and bottom so this accounts for that 
    So next frame would be at 50 x 
    // -25
    // -87 
    35 is the Y axis
  */
}
</style>