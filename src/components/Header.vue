<template>
<div class="header">
  <div class="header-blue" />
  <div class="header-content-wrap container">
    <div class="header-content">
      <router-link :to="{ name: 'Home' }">
        <div
          class="header-link"
          :class="{ active: $route.name === 'Home' }"
        >
          <DashboardIcon :color="$route.name === 'Home' ? '#0087cb' : '#a2a2a2'" />
          {{ $t('dashboard') }}
        </div>
      </router-link>
      <router-link :to="{ name: 'Proposals' }">
        <div
          class="header-link"
          :class="{ active: $route.name === 'Proposals' }"
        >
          {{ $t('proposals') }}
        </div>
      </router-link>
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
    padding: 0 32px 0 16px;
    display: flex;
    align-items: center;
    background-color: white;
    height: 72px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    .header-link {
      @mixin medium 16px;
      pointer-events: none;
      display: flex;
      align-items: baseline;
      color: $text-light;
      margin-left: 24px;
      padding-top: 4px;
      svg {
        width: 13px;
        margin-right: 8px;
      }
      &.active {
        color: $blue;
        border-bottom: 1px solid $blue;
      }
    }
    .header-right {
      @mixin semibold 16px;
      margin-left: auto;
      cursor: pointer;
      padding-top: 4px;
      .connected {
        color: $red;
      }
      .header-right-text {
        text-align: right;
      }
    }
  }
}
</style>
