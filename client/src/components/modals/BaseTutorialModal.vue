<template>
  <div>
		<!--Background-->

    <div class="opacity-25 fixed inset-0 bg-black z-100"></div>
    <div id="window" class=" fixed z-100 "></div>
    <div id="info" class="cursor-disabled fixed z-100   top-[10rem] left-[10rem] bg-white opacity-100">
      <h1 v-if="textWindow"> {{textWindow.content}} </h1>
      <button class="text-red-700" @click="saveAndClose"> Close </button>
    </div>
  </div>
</template>

<script setup>
/*

  interface:
    I did not want to create many tutorals, so the idea is that the page that triggers the modal, will also give it parameters below:

    showWindow - height, width, top, left,bottom,right 
    textWindow - content, style , height, width, top, left,bottom,right
    Text content
*/
import {defineEmits, onMounted} from 'vue'
const emit = defineEmits(['update:modelValue'])
const {model_value, tutorialName, showWindow, textWindow } = defineProps({
  tutorialName:{
    type:String
  },
  model_value:{
    type: String,
  },
  showWindow:{
  },
  textWindow:{
  }
})
onMounted(()=>{
  const windowEle = document.getElementById("window")
  windowEle.style.height = showWindow.height;
  windowEle.style.width = showWindow.width;
  windowEle.style.top = showWindow.top;
  windowEle.style.left = showWindow.left;
  windowEle.style.bottom = showWindow.bottom;
  windowEle.style.right = showWindow.right;

  const infoEle = document.getElementById("info")
  if(textWindow.style){
    infoEle.style = textWindow.style
  }
  infoEle.style.height = textWindow.height;
  infoEle.style.width = textWindow.width;
  infoEle.style.top = textWindow.top;
  infoEle.style.left = textWindow.left;
  infoEle.style.bottom = textWindow.bottom;
  infoEle.style.right = textWindow.right;

  console.log(windowEle,infoEle,textWindow.style);
})

console.log(tutorialName,"bname?",showWindow,textWindow);
function saveAndClose(){
  localStorage.setItem(tutorialName, true);
  emit('update:modelValue',false)  
}
</script>

<style scoped>
#window {
  width: 150px;
  height: 150px;
  border: 1px solid red;
  box-shadow: 0 0 0 99999px rgba(220, 220, 220, .25)
}
</style>