<template>
<div class="proposal-wrap">
  <Header />
  <ProposalsHeader :showBack="true" />
  <transition name="fade" mode="out-in">
    <div v-if="proposal">
      <Proposal :proposal="proposal" />
      <Comments :comments="proposal.comments" />
    </div>
    <div v-else-if="notFound" class="tpa-empty">
      {{ $t('proposals.not_found') }}
    </div>
    <div v-else class="tpa-empty">
      <Spinner />
    </div>
  </transition>
  <ConnectModal />
</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getProposal } from '/src/utils/api';

export default {
  setup() {
    const route = useRoute();
    const proposal = ref(null);
    const notFound = ref(false);

    onMounted(async () => {
      const id = parseInt(route.params.id);
      proposal.value = getProposal(id);
      if(!proposal.value) {
        notFound.value = true;
      }
    });
    
    return {
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
