<template>
<Modal :show="show" @cancel="$emit('cancel')">
  <div class="unlock-modal modal-content">
    <div class="unlock-title">
      {{ $t('unlock_modal.title') }}
    </div>
    <div class="unlock-subtitle">
      {{ $t('unlock_modal.subtitle', { days: unstakeDays }) }}
    </div>
    <div v-if="error" class="unlock-error">
      {{ error }}
    </div>
    <div class="unlock-amount-wrap">
      <div class="unlock-amount-text">
        {{ $t('locked') }}
      </div>
      <div class="unlock-amount">
        {{ lockedDisplay }}
      </div>
    </div>
    <div class="unlock-amount-wrap">
      <div class="unlock-amount-text">
        {{ $t('unlock_modal.releasable') }}
      </div>
      <div class="unlock-amount">
        {{ releasableDisplay }}
      </div>
      <img :src="Reload" @click="updateReleasable">
    </div>
    <div class="unlock-button-wrap">
      <div class="unlock-button" @click="unlock">
        <LoadingText :text="$t('unlock_modal.button')" :loading="!!txState.activeUnlock" />
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue';
import { useStore, TxType, TxStatus } from '/src/store';
import useChain from '/src/chain/useChain';
import { useI18n } from 'vue-i18n';

const isTxActive = tx => (
  tx.status === TxStatus.PENDING || tx.status === TxStatus.SUBMITTED
);

export default {
  name: 'unlock-modal',
  emits: ['cancel'],
  props: {
    show: Boolean,
  },
  setup(props) {
    const { show } = toRefs(props);
    const { t } = useI18n();
    const store = useStore();
    const { lockedTpa, releasableTpa } = store;
    const {
      submitUnstake,
      getError,
      getUserReleasable,
      getUserLocked,
      toEthDisplay,
      getUnstakeDays,
    } = useChain(store, t);
    const { latestTx } = store;
    const error = ref(null);
    const unstakeDays = ref('?');

    const lockedDisplay = computed(() => toEthDisplay(lockedTpa.value));

    const releasableDisplay = computed(() => (
      releasableTpa.value === null ? '?' : toEthDisplay(releasableTpa.value)
    ));

    const unlock = async () => {
      error.value = null;
      try {
        await submitUnstake();        
      } catch(e) {
        error.value = getError(e);
      }
    };
    const txState = computed(() => {
      const tx = latestTx.value;
      if(tx && isTxActive(tx) && tx.type === TxType.UNSTAKE) {
        return {
          activeUnlock: tx.hash,
        };
      }
      return {};
    });
    watch(show, async (newShow) => {
      if(newShow) {
        unstakeDays.value = await getUnstakeDays();
        await getUserLocked();
        await getUserReleasable();
      }
    });
    return {
      lockedDisplay,
      releasableDisplay,
      updateLocked: getUserLocked,
      updateReleasable: getUserReleasable,
      unstakeDays,
      unlock,
      error,
      txState,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.unlock-modal {
  .unlock-title {
    @mixin title 18px;
  }
  .unlock-subtitle {
    @mixin text 15px;
    margin-top: 16px;
    line-height: 24px;
  }
  .unlock-error {
    @mixin medium 11px;
    color: $red;
    margin-top: 8px;
  }
  .unlock-button-wrap {
    margin-top: 16px;
    display: flex;
  }
  .unlock-button {
    @mixin title 15px;
    color: white;
    background-color: $blue;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  .unlock-amount-wrap {
    display: flex;
    margin-top: 16px;
    align-items: center;
    .unlock-amount-text {
      @mixin medium 15px;
    }
    .unlock-amount {
      @mixin semibold 15px;
      margin-left: 6px;
    }
    img {
      width: 20px;
      cursor: pointer;
      margin-left: 12px;
    }
  }
}
</style>
