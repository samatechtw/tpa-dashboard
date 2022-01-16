import { ref } from 'vue';
import { intervalToDuration } from 'date-fns';
import { TxStatus, useChain } from '@samatech/vue3-eth';
import {
  ETH_CHAIN_ID,
  TOKEN_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
  LOCKER_CONTRACT_ADDRESS,
} from '/src/utils/config';
import { TxType } from '/src/store';
import { tokenContract, stakingContract, lockerContract } from './contracts';

// TODO non-reactive due to issue with proxying ethers stuff
const state = {
  stakingContract: null,
  tokenContract: null,
  lockerContract: null,
  loadCallbackList: [],
};

export { TxStatus };

const showConnect = ref(false);

export function useTpa(store) {
  const { address, addTx } = store;

  const chain = useChain({ ethChainId: ETH_CHAIN_ID });

  const getUserInfo = async () => {
    await getUserAdmin();
    await getUserBalance();
    await getUserStaked();
    await getUserLocked();
    state.loadCallbackList.forEach(async cb => await cb);
  };

  chain.onAccountsChanged(async (accounts) => {
    store.setAddress(accounts[0]);
    await getUserInfo();
  });

  chain.onChainChanged(getUserInfo);

  chain.onDisconnect(() => {
    store.clearState();
  });

  chain.onConnect(async (address) => {
    store.setAddress(address);
    showConnect.value = false;
    await getUserInfo();
  });

  chain.onSetupProvider((signer) => {
    state.tokenContract = tokenContract(signer, TOKEN_CONTRACT_ADDRESS);
    state.stakingContract = stakingContract(signer, STAKING_CONTRACT_ADDRESS);
    state.lockerContract = lockerContract(signer, LOCKER_CONTRACT_ADDRESS);
  });

  const onLoad = async (callback) => {
    if(state.loaded) {
      await callback;
    } else {
      state.loadCallbackList.push(callback);
    }
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

  const connectWallet = async (walletName) => {
    store.setWalletName(walletName);
    chain.connectWallet(walletName);
  };

  const reconnectWallet = async () => {
    await chain.reconnectWallet(store.walletName.value);
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

  return {
    // Chain variables and functions
    disconnectWallet: chain.disconnectWallet,
    getTxReceipt: chain.getTxReceipt,
    getSigner: chain.getSigner,
    getError: chain.getError,
    toEth: chain.toEth,
    toEthDisplay: chain.toEthDisplay,
    toWei: chain.toWei,
    loadingAccount: chain.loadingAccount,
    showConnect: chain.showConnect,
    connectError: chain.connectError,
    wrongNetwork: chain.wrongNetwork,
    walletConnected: chain.walletConnected,
    // Chain overrides
    connectWallet,
    reconnectWallet,
    // TPA specific functions
    onLoad,
    submitTx,
    getUserAdmin,
    getUnstakeDays,
    getUserBalance,
    getUserAllowance,
    getUserStaked,
    getUserLocked,
    getUserReleasable,
    getBalance,
    submitStake,
    submitUnstake,
    submitDividend,
    submitAddAdmin,
    submitApproval,
  };
};
