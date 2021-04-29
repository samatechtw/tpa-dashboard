import { ethers } from 'ethers/lib.esm';
import { ref } from 'vue';
import { TOKEN_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from '/src/utils/config';
import { tokenContract, stakingContract } from './contracts';
import useMetamask from './useMetamask';
import useWalletconnect from './useWalletconnect';

function chainInit(provider) {
  return new ethers.providers.Web3Provider(provider);
}

// TODO non-reactive due to issue with proxying ethers stuff
let provider = null;
let signer = null;

export default function useChain(store, t) {
  const chainId = ref(null);
  const tpaToken = ref(null);
  const tpaStaking = ref(null);
  const loadingAccount = ref(false);
  const showConnect = ref(false);
  const walletSource = ref(null);
  const connectError = ref(null);
  const address = store.address;

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
    provider = chainInit(walletProvider);
    signer = provider.getSigner();
    tpaToken.value = tokenContract(signer, TOKEN_CONTRACT_ADDRESS);
    tpaStaking.value = stakingContract(signer, STAKING_CONTRACT_ADDRESS);
    await subscribeProvider(provider);

    chainId.value = (await provider.getNetwork()).chainId;
    console.log('Network/chain ID:', chainId.value);
    return signer.getAddress();
  };

  const reconnectWallet = async () => {
    const walletProvider = await setupWallet(store.walletName.value);
    await setupProvider(walletProvider);
    await getUserBalance();
  };

  const connectWallet = async (walletName) => {
    store.setWalletName(walletName);
    try {
      const walletProvider = await setupWallet(walletName);
      await walletSource.value.connectWallet(walletProvider);
      const address = await setupProvider(walletProvider);

      showConnect.value = false;
      store.setAddress(address);
      await getUserBalance();
    } catch(error) {
      connectError.value = error.message;
    } finally {
      loadingAccount.value = false;
    }
  };

  const disconnect = () => {
    provider = null;
    store.clearState();
  };

  const disconnectWallet = async () => {
    if(provider && provider.close) {
      await provider.close();
    }
    disconnect();
  };

  const getUserBalance = async () => {
    const tpa = await getBalance(address.value);
    store.setUserTpa(tpa.toString());
  };

  const getBalance = (address) => {
    return tpaToken.value.balanceOf(address);
  };

  const getError = exception => (
    walletSource.value.getError(exception)
  );

  const getSigner = () => signer;

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
    address,
    loadingAccount,
    showConnect,
    showConnectModal,
    connectWallet,
    reconnectWallet,
    disconnectWallet,
    getUserBalance,
    getBalance,
    getSigner,
    getError,
  };
};
