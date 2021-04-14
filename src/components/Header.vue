<template>
<div class="header">
  <div class="header-blue" />
  <div class="header-content-wrap container">
    <div class="header-content">
      <div class="header-left">
        <img :src="Dashboard">
        {{ $t('dashboard') }}
      </div>
      <div class="header-right">
        <div class="header-right-text" @click="$emit('toggle-connect')">
          <span v-if="connected" class="connected">
            {{ $t('disconnect') }}
          </span>
          <span v-else>
            {{ $t('connect') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'tpa-header',
  emits: ['toggle-connect'],
  props: {
    connected: Boolean,
  },
  setup() {
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.header {
  position: relative;
  .header-blue {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 62px;
    background-color: $blue;
  }
  .header-content-wrap {
    position: relative;
    padding-top: 26px;
  }
  .header-content {
    padding: 0 40px;
    display: flex;
    align-items: center;
    background-color: white;
    height: 72px;
    border-radius: 4px;
    color: $blue;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    .header-left {
      @mixin medium 16px;
      pointer-events: none;
      display: flex;
      align-items: baseline;
      img {
        width: 13px;
        margin-right: 8px;
      }
    }
    .header-right {
      @mixin semibold 16px;
      margin-left: auto;
      cursor: pointer;
      .connected {
        color: $red;
      }
    }
  }
}
</style>
