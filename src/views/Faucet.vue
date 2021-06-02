<template>
<div class="home-wrap">
  <Header />
  <transition name="fade" mode="out-in">
    <div v-if="walletConnected" class="faucet container">
      <RecentTx :tx="latestTxData" />
      <div class="faucet-top">
        <div class="faucet-box box">
          <div class="faucet-title">
            {{ $t('faucet.text') }}
          </div>
          <div class="faucet-text">
            {{ $t('faucet.faucet_balance', { balance: faucetBalance }) }}
          </div>
          <div class="faucet-text">
            {{ $t('faucet.balance', { balance }) }}
          </div>
          <div class="tpa-button" @click="faucetRequest">
            <LoadingText :text="$t('faucet.button')" :loading="requestLoading" />
          </div>
          <div v-if="error" class="faucet-error">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="loadingAccount" class="tpa-empty">
      <Spinner />
    </div>
    <div v-else class="tpa-empty">
      {{ $t('faucet.no_wallet') }}
    </div>
  </transition>
  <ConnectModal />
</div>
</template>

<script>
import { watch, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  PURCHASE_LINK,
  purchaseExternal,
  FAUCET_CONTRACT_ADDRESS,
} from '/src/utils/config';
import { useStore, TxType } from '/src/store';
import { getContract } from '/src/chain/contracts';
import useChain from '/src/chain/useChain';

const FaucetAbi = [
  {
    "inputs": [],
    "name": "distributionAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "request",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default {
  name: 'faucet',
  setup() {
    const { t } = useI18n();
    if(purchaseExternal) {
      location.href = PURCHASE_LINK;
      return;
    }
    const store = useStore();
    const faucetBalance = ref(0);
    const requestLoading = ref(false);
    let faucetContract = null;
    const error = ref(null);
    const {
      userTpa,
      latestTx,
    } = store;
    const {
      getSigner,
      loadingAccount,
      getBalance,
      getUserBalance,
      submitTx,
      getError,
      toEthDisplay,
      walletConnected,
    } = useChain(store, t);

    const updateFaucetBalance = async () => {
      const val = await getBalance(FAUCET_CONTRACT_ADDRESS);
      faucetBalance.value = toEthDisplay(val);
    };
    const balance = computed(() => (
      toEthDisplay(userTpa.value)
    ));
    const faucetRequest = async () => {
      requestLoading.value = true;
      error.value = null;
      try {
        await submitTx(TxType.FAUCET, faucetContract.request());
        await updateFaucetBalance();
        await getUserBalance();
      } catch(e) {
        error.value = getError(e);
      }
      requestLoading.value = false;
    };
    const latestTxData = computed(() => {
      const hourAgo = new Date().getTime() - (1000 * 60 * 60);
      const tx = latestTx.value;
      if(tx && (tx.timestamp > hourAgo)) {
        return tx;
      }
      return null;
    });

    watch(walletConnected, async (connected) => {
      if(connected) {
        faucetContract = getContract(FAUCET_CONTRACT_ADDRESS, FaucetAbi, getSigner());
        await updateFaucetBalance();
      }
    });
    onMounted(async () => {
      if(walletConnected.value && !faucetContract) {
        faucetContract = getContract(FAUCET_CONTRACT_ADDRESS, FaucetAbi, getSigner());
        await updateFaucetBalance();
      }
    });
    return {
      error,
      loadingAccount,
      walletConnected,
      balance,
      faucetBalance,
      faucetRequest,
      requestLoading,
      latestTxData,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.faucet {
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  .faucet-top {
    margin-top: 24px;
    display: flex;
    .faucet-box {
      padding: 28px 64px 24px;
      @mixin medium 17px;
      text-align: center;
      .faucet-title {
        @mixin semibold 19px;
      }
      .faucet-text {
        margin-top: 16px;
      }
      .tpa-button {
        margin-top: 24px;
      }
      .faucet-error {
        color: $red;
        font-size: 12px;
        margin-top: 12px;
      }
    }
  }
}
</style>
