<template>
<div v-if="txDisplay" class="tpa-tx box">
  <div class="tpa-tx-title-text">
    {{ $t('tx.title') }}
  </div>
  <div class="tpa-txs">
    <div class="tpa-tx-title">
      <div class="tpa-tx-label">
        <span>{{ txDisplay.label }}</span>
        <span class="tpa-tx-time">
          {{ $t('tx.time', { time: txDisplay.time }) }}
        </span>
      </div>
    </div>
    <div class="tpa-tx-status" :class="txDisplay.status">
      {{ txDisplay.status }}
    </div>
    <div class="tpa-tx-link">
      <a :href="txDisplay.link" target="_blank">
        {{ $t('etherscan') }}
      </a>
    </div>
  </div>
</div>
</template>

<script>
import { computed, onMounted, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDistanceToNow } from 'date-fns';
import useChain from '/src/chain/useChain';
import { etherscanLink } from '/src/utils/config';
import { useStore, TxStatus } from '/src/store';

export default {
  props: {
    tx: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const { tx } = toRefs(props);
    const { t } = useI18n();
    const store = useStore();
    const { getTxReceipt } = useChain(store, t);

    const checkTx = async () => {
      if(tx.value && tx.value.status !== TxStatus.COMPLETED) {
        const txReceipt = await getTxReceipt(tx.value.hash);
        let status = TxStatus.PENDING;
        if(txReceipt) {
          status = (txReceipt.status === 1) ? TxStatus.COMPLETED : TxStatus.FAILED;
        }
        store.updateLatestTx({ ...tx.value, status });
      }
    };
    watch(tx, checkTx);
    onMounted(checkTx);
    const txDisplay = computed(() => (tx.value && {
      link: `${etherscanLink}${tx.value.hash}`,
      label: t(tx.value.type),
      time: formatDistanceToNow(new Date(tx.value.timestamp)),
      status: t(tx.value.status),
    }));
    return { txDisplay };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.tpa-tx {
  padding: 20px 64px 20px 48px;
  width: 100%;
  margin-top: 16px;
  .tpa-txs {
    display: flex;
    align-items: center;
  }
  .tpa-tx-title-text {
    @mixin title 13px;
  }
  .tpa-tx-label {
    @mixin semibold 15px;
    color: $text-light;
    margin-top: 8px;
    padding-left: 16px;
  }
  .tpa-tx-time {
    font-size: 11px;
    margin-left: 8px;
  }
  .tpa-tx-status {
    @mixin semibold 13px;
    margin-left: auto;
    &.Completed {
      color: $green;
    }
    &.Failed {
      color: $red;
    }
  }
  .tpa-tx-link {
    @mixin medium 12px;
    color: $blue;
    margin-left: 6px;
  }
}
</style>
