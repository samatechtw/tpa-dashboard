<template>
<Modal :show="show" @cancel="$emit('cancel')">
  <div class="unstake-modal modal-content">
    <div class="unstake-title">
      {{ $t('unstake_modal.title') }}
    </div>
    <div class="unstake-subtitle">
      {{ $t('unstake_modal.subtitle', { days: unstakeDays }) }}
    </div>
    <div v-if="error" class="unstake-error">
      {{ error }}
    </div>
    <div class="unstake-amount-wrap">
      <div class="unstake-amount-text">
        {{ $t('unstake_modal.staked') }}
      </div>
      <div class="unstake-amount">
        {{ stakedDisplay }}
      </div>
      <img :src="Reload" @click="updateStaked">
    </div>
    <div class="unstake-button-wrap">
      <div class="unstake-button" @click="unstake">
        <LoadingText :text="$t('unstake')" :loading="!!txState.activeUnstake" />
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue';
import { useTpa, TxStatus } from '/src/chain/useTpa';
import { useI18n } from 'vue-i18n';
import { useStore, TxType } from '/src/store';

const isTxActive = tx => (
  tx.status === TxStatus.PENDING || tx.status === TxStatus.SUBMITTED
);

export default {
  name: 'unstake-modal',
  emits: ['cancel'],
  props: {
    show: Boolean,
  },
  setup(props) {
    const { show } = toRefs(props);
    const { t } = useI18n();
    const store = useStore();
    const { stakedTpa } = store;
    const {
      submitUnstake,
      getError,
      getUserStaked,
      toEthDisplay,
      getUnstakeDays,
    } = useTpa(store);
    const { latestTx } = store;
    const error = ref(null);
    const unstakeDays = ref('?');

    const stakedDisplay = computed(() => (
      stakedTpa.value === null ? '?' : toEthDisplay(stakedTpa.value)
    ));

    const unstake = async () => {
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
          activeUnstake: tx.hash,
        };
      }
      return {};
    });
    const updateStaked = async () => {
      await getUserStaked();
    };
    watch(show, async (newShow) => {
      if(newShow) {
        unstakeDays.value = await getUnstakeDays();
      }
    });
    return {
      stakedDisplay,
      updateStaked,
      unstakeDays,
      unstake,
      error,
      txState,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.unstake-modal {
  .unstake-title {
    @mixin title 18px;
  }
  .unstake-subtitle {
    @mixin text 15px;
    margin-top: 16px;
    line-height: 24px;
  }
  .stake-error {
    @mixin medium 11px;
    color: $red;
    margin-top: 8px;
  }
  .unstake-button-wrap {
    margin-top: 16px;
    display: flex;
  }
  .unstake-button {
    @mixin title 15px;
    color: white;
    background-color: $blue;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  .unstake-amount-wrap {
    display: flex;
    margin-top: 16px;
    align-items: center;
    .unstake-amount-text {
      @mixin medium 15px;
    }
    .unstake-amount {
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
