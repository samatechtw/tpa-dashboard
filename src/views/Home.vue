<template>
<div class="home-wrap">
  <Header />
  <transition name="fade" mode="out-in">
    <Dashboard v-if="walletConnected" />
    <div v-else-if="loadingAccount" class="tpa-empty">
      <Spinner />
    </div>
    <div v-else-if="wrongNetwork" class="tpa-empty">
      {{ $t('wrong_network', { network: ETH_NETWORK }) }}
    </div>
    <div v-else class="tpa-empty">
      {{ $t('no_wallet') }}
    </div>
  </transition>
  <ConnectModal />
</div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';
import { ETH_NETWORK } from '/src/utils/config';

export default {
  name: 'home',
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const {
      loadingAccount,
      walletConnected,
      wrongNetwork,
    } = useChain(store, t);
    
    return {
      loadingAccount,
      walletConnected,
      wrongNetwork,
      ETH_NETWORK,
    };
  },
};
</script>
