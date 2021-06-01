
// import * as WalletConnectProvider from '@walletconnect/web3-provider';
import { INFURA_ID } from '../utils/config';

export default function useWalletconnect(t) {
  const getProvider = () => {
    /*
    const provider = new WalletConnectProvider.WalletConnectProvider({
      infuraId: INFURA_ID,
    });
    provider.connector.on('display_uri', (err, payload) => {
      const uri = payload.params[0];
      console.log('WALLETCONNECT QRCODE', uri);
    });
    */
  };
  const connectWallet = async (provider) => {
  };
  const getError = (error) => {
    return t('errors.unknown');
  };
  return { getProvider, connectWallet };
};
