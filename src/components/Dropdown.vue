<template>
<div
  v-clickaway="clickaway"
  class="dropdown"
  @click="toggle(!modelValue)"
>
  <slot />
  <transition name="menu">
    <div
      v-show="modelValue"
      ref="dropdown"
      class="dropdown-menu show"
      @click.stop
    >
      <slot name="dropdown" />
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'dropdown',
  emits: ['update:modelValue'],
  props: {
    modelValue: Boolean,
  },
  setup(_props, { emit }) {
    const toggle = (value) => {
      emit('update:modelValue', value);
    };
    const clickaway = () => {
      toggle(false);
    };
    return { toggle, clickaway };
  }
};
</script>

<style lang="postcss">
.dropdown {
  position: relative;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  left: 0;
  width: 100%;
  top: 20px;
}
.menu-enter-active, .menu-leave-active {
  transition: all 250ms;
  transition-timing-function: cubic-bezier(.53,2,.36,.85);
}
.menu-enter-from, .menu-leave-active {
  opacity: 0;
}
.menu-enter-from, .menu-leave-to {
  position: absolute;
}
.menu-enter-from {
  transform: translateY(-10px);
}
.menu-leave-active {
  transform: translateY(10px);
}
</style>
