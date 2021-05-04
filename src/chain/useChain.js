import { ethers } from 'ethers/lib.esm';
import { ref } from 'vue';
import { TOKEN_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from '/src/utils/config';
import { TxStatus, TxType } from '/src/store';
import { tokenContract, stakingContract } from './contracts';
import useMetamask from './useMetamask';
import useWalletconnect from './useWalletconnect';

function chainInit(provider) {
  return new ethers.providers.Web3Provider(provider);
}

// TODO non-reactive due to issue with proxying ethers stuff
const state = {
  provider: null,
  signer: null,
  stakingContract: null,
  tokenContract: null,
};

const chainId = ref(null);
const loadingAccount = ref(false);
const showConnect = ref(false);
const walletSource = ref(null);
const connectError = ref(null);

export default function useChain(store, t) {
  const { address, addTx } = store;

  const showConnectModal = () => {
    if(store.address.value) {
      disconnectWallet();
    } else {
      showConnect.value = true;
    }
  };

  const setupWallet = async (walletName) => {
    connectError.value = null;
    if(walletName === 'metamask') {
      walletSource.value = useMetamask(t);
    } else if(walletName === 'walletconnect') {
      walletSource.value = useWalletconnect(t);
    }
    return walletSource.value.getProvider();
  };

  const setupProvider = async (walletProvider) => {
    state.provider = chainInit(walletProvider);
    state.signer = state.provider.getSigner();
    state.tokenContract = tokenContract(state.signer, TOKEN_CONTRACT_ADDRESS);
    state.stakingContract = stakingContract(state.signer, STAKING_CONTRACT_ADDRESS);
    await subscribeProvider(state.provider);

    chainId.value = (await state.provider.getNetwork()).chainId;
    console.log('Network/chain ID:', chainId.value);
    return state.signer.getAddress();
  };

  const getUserInfo = async () => {
    await getUserBalance();
    await getUserStaked();
  };

  const reconnectWallet = async () => {
    try {
      const walletProvider = await setupWallet(store.walletName.value);
      await setupProvider(walletProvider);
      await getUserInfo();
    } catch(e) {
      console.log('Fail to reconnect');
      disconnect();
    }
  };

  const connectWallet = async (walletName) => {
    store.setWalletName(walletName);
    try {
      const walletProvider = await setupWallet(walletName);
      await walletSource.value.connectWallet(walletProvider);
      const address = await setupProvider(walletProvider);
      console.log('SIGNING', address);
      showConnect.value = false;
      store.setAddress(address);
      await getUserInfo();
    } catch(error) {
      console.log('ERROR', error);
      connectError.value = error.message;
    } finally {
      loadingAccount.value = false;
    }
  };

  const disconnect = () => {
    state.provider = null;
    store.clearState();
  };

  const disconnectWallet = async () => {
    if(state.provider && state.provider.close) {
      await state.provider.close();
    }
    disconnect();
  };

  const getUserBalance = async () => {
    const tpa = await getBalance(address.value);
    store.setUserTpa(tpa.toString());
  };

  const getUserStaked = async () => {
    const staked = await state.stakingContract.getStake(address.value);
    store.setUserStaked(staked.toString());
  };

  const getUserAllowance = async () => {
    const allowance = await state.tokenContract.allowance(
      address.value,
      state.stakingContract.address,
    );
    return toEth(allowance);
  };

  const getBalance = (address) => {
    return state.tokenContract.balanceOf(address);
  };

  const submitTx = async (txType, tx) => {
    const txResult = await tx;
    addTx({
      hash: txResult.hash,
      timestamp: new Date().getTime(),
      type: txType,
      status: TxStatus.SUBMITTED,
    });
  };

  const submitStake = async (amount) => {
    await submitTx(
      TxType.STAKE,
      state.stakingContract.stake(amount.toString()),
    );
  };

  const submitApproval = async (amount) => {
    await submitTx(
      TxType.APPROVAL,
      state.tokenContract.approve(state.stakingContract.address, amount.toString()),
    );
  };

  const getTx = (hash) => {
    if(state.provider) {
      return state.provider.getTransaction(hash);
    }
    return null;
  };

  const getTxReceipt = (hash) => {
    console.log('GET TX RECEIPT', state.provider, hash);
    if(state.provider) {
      return state.provider.getTransactionReceipt(hash);
    }
    return null;
  };

  const getError = exception => (
    walletSource.value.getError(exception)
  );

  const toEth = (val) => {
    const wei = BigInt(val.toString());
    return wei / 1000000000000000000n;
  };
  const toWei = (val) => {
    const eth = BigInt(val.toString());
    return eth * 1000000000000000000n;
  };

  const getSigner = () => state.signer;

  const subscribeProvider = async (provider) => {
    if(!provider.on) {
      console.log('Provider has no "on" method');
      return;
    }
    provider.on('close', () => disconnect());
    provider.on('accountsChanged', async (accounts) => {
      store.setAddress(accounts[0]);
      await getUserBalance();
    });
    provider.on('chainChanged', async (chainId) => {
      chainId.value = chainId;
      await getUserBalance();
    });

    provider.on('networkChanged', async (_networkId) => {
      const network = await provider.value.getNetwork();
      chainId.value = network.chainId();
      await getUserBalance();
    });
  };

  return {
    loadingAccount,
    showConnect,
    showConnectModal,
    connectWallet,
    reconnectWallet,
    disconnectWallet,
    getUserBalance,
    getUserAllowance,
    getUserStaked,
    getBalance,
    submitTx,
    submitStake,
    submitApproval,
    getTx,
    getTxReceipt,
    getSigner,
    getError,
    toEth,
    toWei,
  };
};
