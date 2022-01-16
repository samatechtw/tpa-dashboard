<template>
<div class="error-message-wrap">
  <transition name="animate-height" appear>
    <div v-if="errorMessage" class="error-message">
      <div class="error">
        <Info color="#f46a6a" class="error-icon" />
        <span>{{ errorMessage }}</span>
      </div>
      <div v-if="errorSubMessage" class="error-submessage">
        <span>{{ errorSubMessage }}</span>
      </div>
    </div>
  </transition>
</div>
</template>

<script>

export default {
  props: {
    errorMessage: {
      type: String,
      default: null,
    },
    errorSubMessage: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.error-message-wrap {
  width: 100%;

  .error {
    margin-top: 0;
    margin-bottom: 0;
    @mixin semibold 12px;
    line-height: 24px;
    color: $red;
    padding-top: 9px;
    @mixin flex-center;

    .error-icon {
      margin-right: 8px;
    }
    span {
      padding-top: 1px;
    }
  }
  .error-icon {
    flex-shrink: 0;
  }
  .error-message {
    max-height: 100px;
    opacity: 1;
    transition: all 0.3s;
  }

  .error-submessage {
    padding-left: 24px;
    width: 100%;
    span {
      @mixin text 12px;
      line-height: 19px;
      color: #707073;
    }
  }
  .animate-height-enter, .animate-height-leave-to {
    max-height: 0;
    opacity: 0;
  }
}

</style>
