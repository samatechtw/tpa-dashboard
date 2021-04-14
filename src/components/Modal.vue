<template>
<transition name="modal">
  <div v-if="show" class="modal-outer" @click="clickOutside">
    <div class="modal-inner">
      <slot />
    </div>
  </div>
</transition>
</template>

<script>
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'modal',
  emits: ['cancel'],
  props: {
    show: Boolean,
  },
  setup(_props, { emit }) {
    function clickOutside(e) {
      if(
        (typeof e.target.className === 'string')
        && (e.target.className.split(' ').indexOf('modal-outer') >= 0)
      ) {
        emit('cancel');
      }
    }
    function escape(e) {
      if(e.key === 'Escape') {
        emit('cancel');
      }
    }
    onMounted(() => {
      document.addEventListener('keydown', escape);
    });
    onUnmounted(() => {
      document.removeEventListener('keydown', escape);
    });
    return { clickOutside };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.modal-outer {
  background-color: rgba(0, 0, 0, 0.6);
  @mixin overlay;
  @mixin flex-center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s linear;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-inner,
.modal-leave-active .modal-inner {
  transition: transform 0.3s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.3s linear;
}
.modal-enter-from .modal-inner,
.modal-leave-to .modal-inner {
  opacity: 0;
  transform: scale(0.7) translateY(-10%);
}
</style>