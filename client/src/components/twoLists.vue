<template>
      <h3>Draggable 1</h3>
      <Sortable class="list-group" :list="list1" group="people" @change="log">
        <div
          class="list-group-item draggable"
          v-for="(element, index) in list1"
          item-key="drag1"
          :key="element.name"
        >
          {{ element.name }} {{ index }}
        </div>
      </Sortable>

      <h3>Draggable 2</h3>
      <Sortable class="list-group" :list="list2" group="people" @change="log">
        <div
          class="list-group-item draggable"
          v-for="(element, index) in list2"
          item-key="drag2"
          :key="element.name"
        >
          {{ element.name }} {{ index }}
        </div>
      </Sortable>

    <rawDisplayer class="col-3" :value="list1" title="List 1" />

    <rawDisplayer class="col-3" :value="list2" title="List 2" />
</template>
<script>
//import draggable from "vuedraggable";
import { Sortable } from "sortablejs-vue3"
export default {
  name: "two-lists",
  display: "Two Lists",
  order: 1,
  components: {
    Sortable
  },
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
    }
  }
};
</script>