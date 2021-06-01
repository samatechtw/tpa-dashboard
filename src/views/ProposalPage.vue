<template>
<div class="proposal-wrap">
  <Header
    :connected="!!address"
    @toggle-connect="showConnectModal"
  />
  <ProposalsHeader :showBack="true" />
  <transition name="fade" mode="out-in">
    <Proposal v-if="proposal" :proposal="proposal" />
    <div v-else-if="notFound" class="tpa-empty">
      {{ $t('proposals.not_found') }}
    </div>
    <div v-else class="tpa-empty">
      <Spinner />
    </div>
  </transition>
  <Proposal />
  <ConnectModal
    :show="showConnect"
    :error="connectError"
    @cancel="showConnect = false"
    @connect="connectWallet"
  />
</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';
import { getProposal } from '/src/utils/api';

export default {
  setup() {
    const route = useRoute();
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

    const proposal = ref(null);
    const notFound = ref(false);

    onMounted(async () => {
      const id = parseInt(route.params.id);
      proposal.value = getProposal(id);
      if(!proposal.value) {
        notFound.value = true;
      }
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
      notFound,
      proposal,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.proposal-wrap {
  background-color: $grey1;
  padding-bottom: 80px;
  min-height: 100%;
}
</style>
