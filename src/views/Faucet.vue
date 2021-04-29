<template>
<div class="home-wrap">
  <Header
    :connected="!!address"
    @toggle-connect="showConnectModal"
  />
  <transition name="fade" mode="out-in">
    <div v-if="address" class="faucet container">
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
    <div v-else-if="loadingAccount" class="dashboard-empty">
      <Spinner />
    </div>
    <div v-else class="dashboard-empty">
      {{ $t('faucet.no_wallet') }}
    </div>
  </transition>
  <ConnectModal
    :show="showConnect"
    :error="connectError"
    @cancel="showConnect = false"
    @connect="connectWallet"
  />
</div>
</template>

<script>
import { watch, ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  PURCHASE_LINK,
  purchaseExternal,
  FAUCET_CONTRACT_ADDRESS,
} from '/src/utils/config';
import storeSetup from '/src/store';
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

const toEth = (val) => {
  const wei = BigInt(val.toString());
  return wei / 1000000000000000000n;
};

export default {
  name: 'faucet',
  setup() {
    const { t } = useI18n();
    if(purchaseExternal) {
      location.href = PURCHASE_LINK;
      return;
    }
    const store = storeSetup();
    const faucetBalance = ref(0);
    const requestLoading = ref(false);
    let faucetContract = null;
    const error = ref(null);
    const {
      connectError,
      connectWallet,
      reconnectWallet,
      showConnect,
      showConnectModal,
      address,
      getSigner,
      loadingAccount,
      getBalance,
      getUserBalance,
      getError,
    } = useChain(store, t);

    const updateFaucetBalance = async () => {
      const val = await getBalance(FAUCET_CONTRACT_ADDRESS);
      faucetBalance.value = toEth(val).toLocaleString();
    };

    watch(address, async (newAddr) => {
      if(newAddr) {
        await updateFaucetBalance();
        faucetContract = getContract(FAUCET_CONTRACT_ADDRESS, FaucetAbi, getSigner());
      }
    });
    const balance = computed(() => (
      toEth(store.userTpa.value).toLocaleString()
    ));
    const faucetRequest = async () => {
      requestLoading.value = true;
      try {
        const tx = await faucetContract.request();
        await tx.wait();
        await updateFaucetBalance();
        await getUserBalance();
      } catch(e) {
        error.value = getError(e);
      }
      requestLoading.value = false;
    };

    onMounted(async () => {
      if(store.address.value) {
        await reconnectWallet();
        faucetContract = getContract(FAUCET_CONTRACT_ADDRESS, FaucetAbi, getSigner());
        await updateFaucetBalance();
      }
    });
    return {
      error,
      connectError,
      loadingAccount,
      address,
      connectWallet,
      showConnectModal,
      showConnect,
      balance,
      faucetBalance,
      faucetRequest,
      requestLoading,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.faucet {
  .faucet-top {
    margin-top: 24px;
    display: flex;
    width: 100%;
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
