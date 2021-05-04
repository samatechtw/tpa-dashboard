# TPA Dashboard

The TPA Dashboard is the frontend for the [TPA Staking Contract](https://github.com/samatechtw/tpa-staking-contract).

When developing locally or testing on e.g. the Ropsten network, a faucet for TPA tokens is provided for convenience at `/get`. In production, this URL
redirects to a real exchange for token purchase.

The `/admin` URL provides a basic interface for sending loan interest to the staking contract for dividend distribution.

## Usage

#### Install

```
npm install
```

#### Develop

```
npm run dev
```

#### Build

```
npm run build
```

### Environment Variables

Default environment variables can be found in `.env.dist`. Values should be filled in and copied to a file called `.env`, which is not
checked in to version control. Variable names are prefixed with `VITE_` in order to be visible in an application built or served with `Vite`.

Key                            | Default         | Description
------------------------------ | --------------- | ---------------------
VITE_ETH_NETWORK               | ropsten         | Ethereum network name
VITE_ETHERSCAN_API_KEY         |                 | API key for accessing Etherscan's API
VITE_INFURA_ID                 |                 | Infura API key for WalletConnect transactions
VITE_TOKEN_CONTRACT_ADDRESS    |                 | TPA Token contract address
VITE_STAKING_CONTRACT_ADDRESS  |                 | Staking contract address
VITE_FAUCET_CONTRACT_ADDRESS   |                 | Faucet contract address
VITE_PURCHASE_LINK             | /get            | URL for token purchase redirect
