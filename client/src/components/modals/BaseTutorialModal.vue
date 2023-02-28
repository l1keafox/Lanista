<template>
  <div v-if ="showSelf">
		<!--Background-->

    <div class="opacity-25 fixed inset-0 bg-black z-100"></div>
    <div id="window" class=" fixed z-100 "></div>
    <div id="info" class="cursor-disabled fixed z-100   top-[10rem] left-[10rem] bg-white opacity-100">
      <h1 v-if="textWindow"> {{textWindow.content}} </h1>
      <div class="flex">
        <button class="text-red-700" v-if="tutorialArray.length-1 > index" @click="next"> Next </button>
        <button class="text-red-700" v-else @click="saveAndClose"> Close </button>
      </div>
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
import {defineEmits, onMounted ,ref } from 'vue'

const showSelf = ref(true);
const showWindow = ref();
const textWindow= ref();
const index = ref(0)
const emit = defineEmits(['update:modelValue'])
const {model_value, tutorialName ,tutorialArray} = defineProps({
  tutorialName:{
    type:String
  },
  model_value:{
    type: String,
  },
  tutorialArray:{
  }
})
onMounted(()=>{
  update()
})


function update(){
  if(tutorialArray[index.value]){
    console.log("WHAT",tutorialArray[index.value]);
  
  showWindow.value = tutorialArray[index.value].show;
  const windowEle = document.getElementById("window")
  console.log(showWindow.value.top);
  windowEle.style.height = showWindow.value.height+"px";
  windowEle.style.width = showWindow.value.width+"px";
  windowEle.style.top = showWindow.value.top+"px";
  windowEle.style.left = showWindow.value.left+"px";
  windowEle.style.bottom = showWindow.value.bottom+"px";
  windowEle.style.right = showWindow.value.right+"px";
  console.log(windowEle,"Whjat is the style")

  const infoEle = document.getElementById("info")
      console.log("That way?",tutorialArray[index.value],tutorialArray[index.value].text.style ); 
      textWindow.value = tutorialArray[index.value].text

      /*
      infoEle.style.top = showWindow.value.top+"px";
      infoEle.style.left = showWindow.value.left+"px";
      infoEle.style.bottom = showWindow.value.bottom+"px";
      infoEle.style.right = showWindow.value.right+"px";

      */
      if(tutorialArray[index.value].text.style == "left"){
        // infoEle.style.height = showWindow.value.height+"px";
        // infoEle.style.width = showWindow.value.width+"px";
        infoEle.style.top = showWindow.value.top+"px";
        infoEle.style.left = showWindow.value.right-showWindow.value.left+"px";
        infoEle.style.bottom = showWindow.value.bottom+"px";
      } else if(tutorialArray[index.value].text.style == "right"){
        infoEle.style.top = showWindow.value.top+"px";
        infoEle.style.left = showWindow.value.right+showWindow.value.left+"px";
        infoEle.style.bottom = showWindow.value.bottom+"px";
      } else if(tutorialArray[index.value].text.style == "top"){
        infoEle.style.top = showWindow.value.top - showWindow.value.height+"px";
        infoEle.style.left = showWindow.value.left+"px";
      } else if(tutorialArray[index.value].text.style == "bottom"){
        infoEle.style.top = showWindow.value.top+showWindow.value.height+"px";
        infoEle.style.left = showWindow.value.left+"px";
      } else {
        console.log("here?");
        infoEle.style.height = textWindow.value.height;
        infoEle.style.width = textWindow.value.width;
        infoEle.style.top = textWindow.value.top;
        infoEle.style.left = textWindow.value.left;
        infoEle.style.bottom = textWindow.value.bottom;
        infoEle.style.right = textWindow.value.right;

        console.log(infoEle, "info style");
      }
  }
}

function next(){
  index.value++;
  update()
}
function saveAndClose(){
  localStorage.setItem(tutorialName, true);
  showSelf.value = false;
  // emit('update:modelValue')
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