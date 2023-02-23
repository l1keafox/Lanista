<template>
	<div class="container">
		<div :style="fillerStyles" class="rounded">
			<span class="label">
        <slot class=""/>
      </span>

		</div>
	</div>
</template>

<script setup>
import { computed,toRefs } from "vue";

const props  = defineProps({
	bgcolor: {
		type: String,
	},
  now:{
    type:Number,
  },
  max:{
    type:Number
  }
});

const { bgcolor, now, max } = toRefs(props);

const fillerStyles = computed(() => {
  let completed = (now.value/max.value)*100 ;
	return {
		height: "100%",
		width: `${completed.toFixed()}%`,
		backgroundColor: bgcolor.value,
		// borderRadius: "inherit",
		textAlign: "right",
	};
});
</script>

<style scoped>
.container {
	height: 20px;
	width: 100%;

	background-color: #e0e0de;
}

.label {
	padding: 5px;
	color: white;
	font-weight: bold;
}
</style>
