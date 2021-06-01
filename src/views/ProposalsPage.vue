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

.proposals-wrap {
  background-color: $grey1;
  padding-bottom: 80px;
  min-height: 100%;
}
</style>
