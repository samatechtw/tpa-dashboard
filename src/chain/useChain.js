import { ethers } from 'ethers/lib.esm';
import Big from 'big.js';
import {  intervalToDuration } from 'date-fns';
import { ref } from 'vue';
import {
  ETH_CHAIN_ID,
  TOKEN_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
  LOCKER_CONTRACT_ADDRESS,
} from '/src/utils/config';
import { TxStatus, TxType } from '/src/store';
import { tokenContract, stakingContract, lockerContract } from './contracts';
import useMetamask from './useMetamask';
import useWalletconnect from './useWalletconnect';

Big.PE = 1000;

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
const walletConnected = ref(false);
const wrongNetwork = ref(false);
const walletSource = ref(null);
const connectError = ref(null);

export default function useChain(store, t) {
  const { address, addTx } = store;

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
    wrongNetwork.value = false;
    state.provider = chainInit(walletProvider);
    state.signer = state.provider.getSigner();
    state.tokenContract = tokenContract(state.signer, TOKEN_CONTRACT_ADDRESS);
    state.stakingContract = stakingContract(state.signer, STAKING_CONTRACT_ADDRESS);
    state.lockerContract = lockerContract(state.signer, LOCKER_CONTRACT_ADDRESS);
    await subscribeProvider(state.provider);

    const network = await state.provider.getNetwork();
    chainId.value = network.chainId;
    if(chainId.value.toString() !== ETH_CHAIN_ID) {
      wrongNetwork.value = true;
      return false;
    }
    return true;
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
      if(await setupProvider(walletProvider)) {
        await getUserInfo();
        walletConnected.value = true;
      }
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
      if(await setupProvider(walletProvider)) {
        showConnect.value = false;
        store.setAddress(await state.signer.getAddress());
        await getUserInfo();
        walletConnected.value = true;
      }
    } catch(error) {
      connectError.value = error.message;
    } finally {
      loadingAccount.value = false;
    }
  };

  const disconnect = () => {
    state.provider = null;
    walletConnected.value = false;
    wrongNetwork.value = false;
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

  const getUserReleasable = async () => {
    const releasable = await state.lockerContract.releasable(address.value);
    store.setUserReleasable(releasable.toString());
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
    let wei = Big(val.toString());
    return wei.div(Big('1000000000000000000')).toNumber();
  };
  const toEthDisplay = (val) => (
    toEth(val).toLocaleString()
  );
  const toWei = (val) => {
    const eth = Big(val.toString());
    return eth.times(Big('1000000000000000000')).toString();
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
      console.log('CHAIN CHANGE', _networkId);
      chainId.value = chainId;
      await getUserInfo();
    });
  };

  return {
    onLoad,
    loadingAccount,
    showConnect,
    connectError,
    connectWallet,
    reconnectWallet,
    walletConnected,
    wrongNetwork,
    disconnectWallet,
    getUserAdmin,
    getUnstakeDays,
    getUserBalance,
    getUserAllowance,
    getUserStaked,
    getUserLocked,
    getUserReleasable,
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
    toEthDisplay,
    toWei,
  };
};
