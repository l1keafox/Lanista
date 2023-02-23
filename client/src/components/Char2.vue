<template>
  <div id="tapp">
    <vue-spritecore
        :id = "1"
        :spritesheet="spritesheet"
        :json="json"
        v-bind:autoplay="true"
        frameSorting="asc"
        v-bind:scaleX="1"
        v-bind:scaleY="1"
        v-bind:loop="true"
        v-bind:lowerBound="0"
        v-bind:upperBound="100"

        v-on:ready="ready"
        v-on:animationStarted="animationStarted(...arguments)"
        v-on:animationStopped="animationStopped(...arguments)"
        v-on:animationReset="animationReset(...arguments)"
        v-on:animationOver="animationOver(...arguments)"

        ref="animation"

    ></vue-spritecore>
  </div>
</template>

<script>
import json from './../assets/animation-data/hume1.json'
import spritesheet from './../assets/hume1.png'
import {ref} from 'vue'
export default {
  name: 'tapp',
  data(){
    return{
      spritesheet,
      json,
      animation:null
    }
  },

  mounted(){
    console.log(this.$refs);
    console.log(this.$refs.animation)
    // this.$refs.animation.play();            //play the animation from frame _lowerBound_ to _upperBound_
    // this.$refs.animation.play(5, 40);       //play the animation from frame 5 to frame 40
    // this.$refs.animation.stop();            //stop(freeze) the animation
    // this.$refs.animation.reset();           //reset the animation at frame _lowerBound_
    // this.$refs.animation.reset(10);         //reset the animation at frame 10
    // this.$refs.animation.playLegacy(30);    //play the animation through the legacy animator with constant framerate of 30
  },
  methods: {
    ready: function(){
      console.log('animation ready');
    },
    animationStarted: function(startFrame, stopFrame){
    console.log('animation started:['+startFrame+','+stopFrame+']');
    },
    animationStopped: function(frame){
    console.log('animation stopped at frame: '+frame);
    },
    animationReset: function(frame){
     console.log('animation resetted at frame: '+frame);
    },
    animationOver: function(frame){
     console.log('animation over at frame:'+frame);
    },

  }
}
</script>