<template>
    <div class="opacity-25 fixed inset-0 bg-black z-50"></div>
    <div v-bind:="$attrs">
    <div id="window" class="fixed z-50"></div>
    <div id="info" class="cursor-disabled fixed text-black bg-white opacity-100 z-50">
      <h1 v-if="tutMessage" class="m-2"> {{tutMessage}} </h1>
      <div class="flex">
        <button class="text-red-700 w-full bg-slate-300 m-2" @click="next"> Next </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/*

  interface:
    elementId
    message
    orientation

*/


const tutMessage= ref();
const getLogged = inject('getLogged');
const emit = defineEmits(['update:modelValue'])
const {model_value, tutorialArray} = defineProps({
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
    if(!getLogged.value){ return;}
    const {elementId,message,orientation} = tutorialArray[0];
    const element = document.getElementById(elementId);
    if(!element) {
      console.log('  -> no element, ERROR ',elementId,tutorialArray)
      // let old = tutorialArray.shift();
      // tutorialArray.push(old);
      return;
    }
    const bounding= element.getBoundingClientRect();

    function toObj(rect){
            let show = {}
            for (const key in rect) {
                if (typeof rect[key] !== "function") {
                    show[key] = rect[key]
                }
            }        
            return show;
    }
    const window = toObj(bounding) ;

    const windowEle = document.getElementById("window")
          windowEle.style.height = window.height+"px";
          windowEle.style.width = window.width+"px";
          windowEle.style.top = window.top+"px";
          windowEle.style.left = window.left+"px";
          windowEle.style.bottom = window.bottom+"px";
          windowEle.style.right = window.right+"px";

    const infoEle = document.getElementById("info")
         tutMessage.value = message

        if(orientation == "left"){
          // infoEle.style.height = window.height+"px";
          // infoEle.style.width = window.width+"px";
          infoEle.style.top = window.top+"px";
          infoEle.style.left = window.right-window.left+"px";
          infoEle.style.bottom = window.bottom+"px";
        } else if(orientation == "right"){
          infoEle.style.top = window.top+"px";
          infoEle.style.left = window.right+"px";
          infoEle.style.bottom = window.bottom+"px";
        } else if(orientation == "top"){
          infoEle.style.top = window.top - window.height+"px";
          infoEle.style.left = window.left+"px";
        } else if(orientation == "bottom"){
          infoEle.style.top = window.top+window.height+"px";
          infoEle.style.left = window.left+"px";
        } else {
          infoEle.style.height = message.value.height;
          infoEle.style.width = message.value.width;
          infoEle.style.top = message.value.top;
          infoEle.style.left = message.value.left;
          infoEle.style.bottom = message.value.bottom;
          infoEle.style.right = message.value.right;
        }
}

function next(){
  localStorage.setItem(tutorialArray[0].elementId, true);
  tutorialArray.shift();
  if(tutorialArray.length == 0){
    emit('update:modelValue')
  } else {
    update()
  }
}
function saveAndClose(){
  localStorage.setItem(tutorialArray[0].elementId, true);
  tutorialArray.shift();
  if(tutorialArray.length == 0){
    emit('update:modelValue')
  }
}
</script>

<style scoped>
#window {
  border: 1px solid red;
  box-shadow: 0 0 0 99999px rgba(220, 220, 220, .25)
}
</style>