<template>
<div class="home-wrap">
  <Header
    :connected="!!address"
    @toggle-connect="connect"
  />
  <transition name="fade" mode="out-in">
    <Dashboard v-if="address" />
    <div v-else class="dashboard-empty">
      {{ $t('no_wallet') }}
    </div>
  </transition>
  <ConnectModal
    :show="showConnect"
    @cancel="showConnect = false"
    @connected="connected"
  />
</div>
</template>

<script>
import { ref } from 'vue';
import storeSetup from '/src/store';

export default {
  name: 'home',
  setup() {
    const store = storeSetup();
    const showConnect = ref(false);
    const connect = () => {
      if(store.address.value) {
        store.setAddress(null);
      } else {
        showConnect.value = true;
      }
    };
    const connected = (connectedAddress) => {
      showConnect.value = false;
      store.setAddress(connectedAddress);
    };
    return {
      address: store.address,
      connect,
      connected,
      showConnect,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.home-wrap {
  background-color: $grey1;
  color: $black;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .dashboard-empty {
    width: 100%;
    flex-grow: 1;
    @mixin flex-center;
    @mixin medium 16px;
    color: $text-light;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  @media (max-width: 640px) {
    height: 100%;
    padding-bottom: 40px;
  }
}
</style>
