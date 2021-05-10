<template>
<Modal :show="show" @cancel="$emit('cancel')">
  <div class="stake-modal">
    <div class="stake-title">
      {{ $t('stake_modal.title') }}
    </div>
    <div class="stake-subtitle">
      {{ $t('stake_modal.subtitle1') }}
    </div>
    <div class="stake-subtitle">
      {{ $t('stake_modal.subtitle2') }}
    </div>
    <TpaInput
      :modelValue="amountToApprove"
      suffix="TPA"
      :title="$t('stake_modal.placeholder')"
      :placeholder="$t('stake_modal.placeholder')"
      @update:modelValue="setAmount"
    />
    <div v-if="inputError" class="stake-error">
      {{ inputError }}
    </div>
    <div class="stake-button-wrap">
      <div class="stake-button" @click="approve">
        <LoadingText :text="$t('stake_modal.approve')" :loading="!!txState.activeApproval" />
      </div>
    </div>
    <div class="stake-allowance-wrap">
      <div class="stake-allowance-text">
        {{ $t('stake_modal.allowance') }}
      </div>
      <div class="stake-allowance">
        {{ allowanceDisplay }}
      </div>
      <img :src="Reload" @click="updateAllowance">
    </div>
    <div v-if="allowance >= 100000" class="stake-button-wrap">
      <div class="stake-button" @click="stake">
        <LoadingText :text="$t('stake_modal.stake')" :loading="!!txState.activeStake" />
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
  name: 'stake-modal',
  emits: ['cancel'],
  props: {
    show: Boolean,
  },
  setup(props) {
    const { show } = toRefs(props);
    const { t } = useI18n();
    const store = useStore();
    const {
      getUserAllowance,
      submitStake,
      submitApproval,
      getError,
      toWei,
    } = useChain(store, t);
    const { latestTx } = store;
    const amountToApprove = ref(100000);
    const inputError = ref(null);
    const allowance = ref(null);

    const allowanceDisplay = computed(() => (
      allowance.value === null ? '?' : allowance.value.toLocaleString()
    ));

    const setAmount = (val) => {
      if(!val) {
        return;
      }
      if(!!val && isNaN(val)) {
        inputError.value = t('errors.number');
      } else {
        inputError.value = null;
        amountToApprove.value = parseInt(val);
      }
    };
    const approve = async () => {
      inputError.value = null;
      try {
        await submitApproval(toWei(amountToApprove.value));
      } catch(e) {
        inputError.value = getError(e);
      }
    };
    const stake = async () => {
      inputError.value = null;
      try {
        await submitStake(toWei(allowance.value));        
      } catch(e) {
        inputError.value = getError(e);
      }
    };
    const txState = computed(() => {
      const tx = latestTx.value;
      if(tx) {
        if(isTxActive(tx)) {
          if(tx.type === TxType.APPROVAL) {
            return {
              activeApproval: tx.hash,
            };
          }
          if(tx.type === TxType.STAKE) {
            return {
              activeStake: tx.hash,
            };
          }
        } else if(tx.type === TxType.APPROVAL && tx.status === TxStatus.COMPLETED) {

        }
      }
      return {};
    });
    const updateAllowance = async () => {
      allowance.value = await getUserAllowance();
    };
    watch(show, async (newShow) => {
      if(newShow) {
        await updateAllowance();
      }
    });
    return {
      amountToApprove,
      allowance,
      allowanceDisplay,
      updateAllowance,
      approve,
      stake,
      setAmount,
      inputError,
      txState,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.modal-inner {
  position: relative;
  top: -10%;
  padding: 0 40px;
}
.stake-modal {
  padding: 24px;
  width: 540px;
  background-color: white;
  border-radius: 4px;
  .stake-title {
    @mixin title 18px;
  }
  .stake-subtitle {
    @mixin text 15px;
    margin-top: 16px;
    line-height: 24px;
  }
  .stake-error {
    @mixin medium 11px;
    color: $red;
    margin-top: 8px;
  }
  .tpa-input-wrap {
    max-width: 280px;
  }
  .stake-button-wrap {
    margin-top: 16px;
    display: flex;
  }
  .stake-button {
    @mixin title 15px;
    color: white;
    background-color: $blue;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  .stake-allowance-wrap {
    display: flex;
    margin-top: 16px;
    align-items: center;
    .stake-allowance-text {
      @mixin medium 15px;
    }
    .stake-allowance {
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
