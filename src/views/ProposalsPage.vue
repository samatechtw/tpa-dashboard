<template>
<div class="proposals-wrap">
  <Header
    :connected="!!address"
    @toggle-connect="showConnectModal"
  />
  <ProposalsHeader />
  <Proposals />
  <ConnectModal
    :show="showConnect"
    :error="connectError"
    @cancel="showConnect = false"
    @connect="connectWallet"
  />
</div>
</template>

<script>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';

export default {
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const { address } = store;
    const {
      connectError,
      connectWallet,
      reconnectWallet,
      showConnect,
      showConnectModal,
      loadingAccount,
    } = useChain(store, t);

    onMounted(async () => {
      if(address.value) {
        await reconnectWallet();
      }
    });
    
    return {
      connectError,
      loadingAccount,
      address,
      connectWallet,
      showConnectModal,
      showConnect,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.home-wrap {
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
}
</style>
