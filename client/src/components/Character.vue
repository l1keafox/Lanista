<template>
  <div class="sprite" style="background-position-x: ${activePosition}px; "></div>
</template>

<script setup>
import { onMounted,ref } from 'vue'
const activePosition = ref(0)
onMounted(() => {
  setInterval(()=>{
    activePosition.value = -25;
  },500);

})
</script>

<style scoped>
.sprite {
  /* display the image*/
  background: url("./../assets/char_a_p1_0bas_humn_v01.png") no-repeat;

  /* each frame is 75px wide so limit container to display one at a time */
  width: 15px; 

  /* main is roughly 150px tall */
  height: 30px;

  /* the image has some space on top and bottom so this accounts for that 
    So next frame would be at 50 x 
    // -25
    // -87 
    35 is the Y axis
  */
   
  background-position-x: -25px ;
  background-position-y: -462px ;
}
</style>