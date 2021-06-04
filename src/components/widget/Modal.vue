<template>
<transition name="modal">
  <div v-if="show" class="modal-outer" @click="clickOutside">
    <div class="modal-inner">
      <div class="modal-close-wrap" @click="$emit('cancel')">
        <img :src="Close">
      </div>
      <slot class="test" />
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
  z-index: 1000;
}
.modal-inner {
  position: relative;
  top: -10%;
  padding: 0 40px;
}
.modal-content {
  width: 540px;
  background-color: white;
  border-radius: 4px;
  padding: 24px;
}
.modal-close-wrap {
  position: absolute;
  top: 8px;
  right: 48px;
  padding: 8px;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
  }
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