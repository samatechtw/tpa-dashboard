import detectEthereumProvider from '@metamask/detect-provider';

export default function useMetamask(t) {

  const getProvider = async () => {
    const provider = await detectEthereumProvider();
    if(provider) {
      return provider;
    } else {
      throw new Error(t('errors.no_metamask'));
    }
  };

  const connectWallet = async (provider) => {
    try {
      await provider.request({
        method: 'wallet_requestPermissions',
        params: [{eth_accounts: {}}],
      });
      await provider.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {}}],
      });
    } catch(e) {
      throw new Error(getError(e));
    }
    //  const wallets = await ethereum.enable();
    // this.metamaskWallet = wallets[0];
  };

  const getError = (error) => {
    if(error.code === 4001) {
      return t('errors.user_rejected');
    } else if(error.code === -32603) {
      // Hacky check for nonce issue
      if(error.message.includes('-32000')) {
        return t('errors.nonce_high');
      }
      return t('errors.tx_reverted');
    }
    console.log(error);
    return t('errors.unknown');
  };

  return { getProvider, getError, connectWallet };
};
