
export const ETH_NETWORK = import.meta.env.VITE_ETH_NETWORK;
export const INFURA_ID = import.meta.env.VITE_INFURA_ID;
export const INFURA_URL = `https://${ETH_NETWORK}.infura.io/v3/${INFURA_ID}`;
export const TOKEN_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;
export const STAKING_CONTRACT_ADDRESS = import.meta.env.VITE_STAKING_CONTRACT_ADDRESS;
export const FAUCET_CONTRACT_ADDRESS = import.meta.env.VITE_FAUCET_CONTRACT_ADDRESS;
export const LOCKER_CONTRACT_ADDRESS = import.meta.env.VITE_LOCKER_CONTRACT_ADDRESS;
export const PURCHASE_LINK = import.meta.env.VITE_PURCHASE_LINK;

export const purchaseExternal = PURCHASE_LINK && PURCHASE_LINK.startsWith('http');

let etherscan = ETH_NETWORK === 'mainnet'
  ? 'https://etherscan.io/tx/'
  : `https://${ETH_NETWORK}.etherscan.io/tx/`;

export const etherscanLink = etherscan;
