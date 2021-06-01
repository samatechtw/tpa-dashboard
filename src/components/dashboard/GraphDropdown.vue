<template>
<Dropdown
  v-model="showDropdown"
  transition="menu"
  class="graph-dropdown"
>
  <div class="graph-dropdown-title">
    {{ labels[index] }}
    <div class="caret" :class="{ open: showDropdown }" />
  </div>
  <template #dropdown>
    <div class="graph-dropdown-labels">
      <div
        v-for="(label, idx) in labels"
        :key="idx"
        @click="select(idx)"
      >
        {{ label }}
      </div>
    </div>
  </template>
</Dropdown>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'graph-dropdown',
  emits: ['select'],
  props: {
    index: {
      type: Number,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const showDropdown = ref(false);
    const select = (index) => {
      showDropdown.value = false;
      emit('select', index);
    };
    return {
      select,
      showDropdown,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

$caret-size: 6px;

.graph-dropdown {
  min-width: 100px;
  padding-left: 8px;
  @mixin text 14px;
  .caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: $caret-size solid $dark2;
    border-right: $caret-size solid transparent;
    border-left: $caret-size solid transparent;
    border-bottom: 0 solid black;
    overflow: hidden;
    transition: 0.2s ease-in;
    &.open {
      border-top-width: 0;
      border-bottom-width: $caret-size;
      transform: rotate(-180deg);
      border-width: $caret-size $caret-size 0 $caret-size;
    }
  }
  .graph-dropdown-labels {
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    padding: 6px 0 6px 8px;
    color: $dark3;
    > div:not(:first-child) {
      margin-top: 4px;
    }
  }
}
</style>
