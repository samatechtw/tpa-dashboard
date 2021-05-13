import { ethers } from 'ethers/lib.esm';
import {  intervalToDuration } from 'date-fns';
import { ref } from 'vue';
import {
  TOKEN_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
  LOCKER_CONTRACT_ADDRESS,
} from '/src/utils/config';
import { TxStatus, TxType } from '/src/store';
import { tokenContract, stakingContract, lockerContract } from './contracts';
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
  lockerContract: null,
  loaded: false,
  loadCallbackList: [],
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

  const onLoad = async (callback) => {
    if(state.loaded) {
      await callback;
    } else {
      state.loadCallbackList.push(callback);
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
    state.lockerContract = lockerContract(state.signer, LOCKER_CONTRACT_ADDRESS);
    await subscribeProvider(state.provider);

    chainId.value = (await state.provider.getNetwork()).chainId;
    console.log('Network/chain ID:', chainId.value);
    return state.signer.getAddress();
  };

  const getUserInfo = async () => {
    await getUserAdmin();
    await getUserBalance();
    await getUserStaked();
    await getUserLocked();
    state.loadCallbackList.forEach(async cb => await cb);
  };

  const reconnectWallet = async () => {
    loadingAccount.value = true;
    try {
      const walletProvider = await setupWallet(store.walletName.value);
      await setupProvider(walletProvider);
      await getUserInfo();
    } catch(e) {
      console.log('Fail to reconnect', e);
      disconnect();
    } finally {
      loadingAccount.value = false;
    }
  };

  const connectWallet = async (walletName) => {
    loadingAccount.value = true;
    store.setWalletName(walletName);
    try {
      const walletProvider = await setupWallet(walletName);
      await walletSource.value.connectWallet(walletProvider);
      const address = await setupProvider(walletProvider);
      showConnect.value = false;
      store.setAddress(address);
      await getUserInfo();
    } catch(error) {
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

  const getUserLocked = async () => {
    const locked = await state.lockerContract.locked(address.value);
    store.setUserLocked(locked.toString());
  };

  const getUserAllowance = async () => {
    const allowance = await state.tokenContract.allowance(
      address.value,
      state.stakingContract.address,
    );
    return toEth(allowance);
  };

  const getUnstakeDays = async () => {
    const time = await state.stakingContract.unstakeTime();
    const duration = intervalToDuration({ start: 0, end: time * 1000 });
    return duration.days || 1;
  };

  const getUserAdmin = async () => {
    const admin = await state.stakingContract.isAdmin(address.value);
    store.setUserAdmin(admin); 
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

  const submitUnstake = async () => {
    await submitTx(
      TxType.UNSTAKE,
      state.stakingContract.unstake(),
    );
  };

  const submitApproval = async (amount) => {
    await submitTx(
      TxType.APPROVAL,
      state.tokenContract.approve(state.stakingContract.address, amount.toString()),
    );
  };

  const submitDividend = async (amount) => {
    await submitTx(
      TxType.DIVIDEND,
      state.stakingContract.postDividend(amount),
    );
  };

  const submitAddAdmin = async (adminAddress) => {
    await submitTx(
      TxType.ADD_ADMIN,
      state.stakingContract.addAdmin(adminAddress),
    );
  };

  const getTx = (hash) => {
    if(state.provider) {
      return state.provider.getTransaction(hash);
    }
    return null;
  };

  const getTxReceipt = (hash) => {
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
      await getUserInfo();
    });
    provider.on('chainChanged', async (chainId) => {
      chainId.value = chainId;
      await getUserInfo();
    });

    provider.on('networkChanged', async (_networkId) => {
      const network = await provider.value.getNetwork();
      chainId.value = network.chainId();
      await getUserInfo();
    });
  };

  return {
    onLoad,
    loadingAccount,
    showConnect,
    showConnectModal,
    connectWallet,
    reconnectWallet,
    disconnectWallet,
    getUserAdmin,
    getUnstakeDays,
    getUserBalance,
    getUserAllowance,
    getUserStaked,
    getBalance,
    submitTx,
    submitStake,
    submitUnstake,
    submitDividend,
    submitAddAdmin,
    submitApproval,
    getTx,
    getTxReceipt,
    getSigner,
    getError,
    toEth,
    toWei,
  };
};
