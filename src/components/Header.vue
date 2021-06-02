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
          :class="{ active: $route.name.startsWith('Proposal') }"
        >
          {{ $t('proposals.title') }}
        </div>
      </router-link>
      <div class="header-right">
        <LanguageSelect />
        <div class="header-right-text" @click="showConnectModal">
          <span v-if="!!address" class="connected">
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
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';

export default {
  name: 'tpa-header',
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const { address } = store;
    const { showConnectModal } = useChain(store, t);
    
    return {
      address,
      showConnectModal,
    };
  }
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
      display: flex;
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
