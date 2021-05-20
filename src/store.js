import { reactive, computed, watch } from 'vue';
import { sub } from 'date-fns';

const storeName = 'dashboard-store';

// Maximum number of historical transactions stored
const TX_HISTORY_LIMIT = 20;

const DAY_MS = 1000 * 60 * 60 * 24;

export const TxType = {
  APPROVAL: 'tx.approval',
  STAKE: 'tx.stake',
  UNSTAKE: 'tx.unstake',
  WITHDRAW: 'tx.withdraw',
  REINVEST: 'tx.reinvest',
  UNLOCK: 'tx.unlock',
  FAUCET: 'tx.faucet',
  DIVIDEND: 'tx.dividend',
  ADD_ADMIN: 'tx.add_admin',
};

export const TxStatus = {
  SUBMITTED: 'tx.submitted',
  PENDING: 'tx.pending',
  COMPLETED: 'tx.completed',
  FAILED: 'tx.failed',
};

const timeDiffs =[
  { weeks: 1 },
  { months: 1},
  { months: 3 },
  { years: 1 },
  { years: 100 },
];

/* Use for generating test graph data

function randInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(initial, count) {
  let date = sub(new Date(), { days: count }).getTime();
  let next = { staked: initial, date };
  const data = [next];
  for(let i = 0; i < count; i += 1) {
    date = add(date, { days: 1 }).getTime();
    const staked = randInterval(next.staked - 2000, next.staked + 4000);
    next = { staked, date };
    data.push(next);
  }
  return data;
}

const initialGraphData = () => generateData(50000, 35);
*/

// Initialize with two points to make Graph.vue implementation simpler
const initialGraphData = () => ([
  {
    staked: 0,
    date: sub(new Date(), { days: 2 }).getTime(),
  },
  {
    staked: 0,
    date: sub(new Date(), { days: 1 }).getTime(),
  },
]);

// Increment to clear data on start, to avoid broken app state
const STORE_VERSION = 11;

const initialState = () => ({
  version: STORE_VERSION,
  address: null,
  updated: (new Date()).getTime(),
  tpaData: initialGraphData(),
  timeIndex: 1,
  userTpa: 0,
  stakedTpa: 0,
  lockedTpa: 0,
  releasableTpa: 0,
  walletName: null,
  txHistory: [],
  admin: false,
});

const saveState = (value) => {
  localStorage.setItem(storeName, JSON.stringify(value));
};

const initialStateSetup = () => {
  data = initialState();
  saveState(data);
};

const raw = localStorage.getItem(storeName);
let data = null;
if(raw) {
  data = JSON.parse(raw);
  if(data.version !== STORE_VERSION) {
    console.log(`Store upgraded from ${data.version} to ${STORE_VERSION}`);
    initialStateSetup();
  }
} else {
  initialStateSetup();
}

const state = reactive(data);

watch(state, saveState);

const tpaWindow = computed(() => {
  const tpa = state.tpaData || [];
  const first = sub(new Date(), timeDiffs[state.timeIndex]);
  const data = [];
  for(let i = tpa.length - 1; i >= 0; i -= 1) {
    if(tpa[i].date >= first) {
      data.unshift(tpa[i]);
    } else {
      break;
    }
  }
  return data;
});

const tpaWindowLastAmount = computed(() => {
  const window = tpaWindow.value;
  const { length } = window;
  return (length > 0) ? window[length - 1].staked : 0;
});

const updateTpaData = (stakedTpa) => {
  const data = state.tpaData || [];
  const dataLen = data.length;
  const prevTime = dataLen ? data[dataLen - 1].date : 0;
  const time = new Date().getTime();
  if(time - prevTime > DAY_MS) {
    state.tpaData = [...data, { staked: stakedTpa, date: time }];
  } else {
    state.tpaData[dataLen - 1].staked = stakedTpa;
  }
};

export const useStore = () => ({
  isUserAdmin: computed(() => state.admin),
  address: computed(() => state.address),
  timeIndex: computed(() => state.timeIndex),
  userTpa: computed(() => state.userTpa),
  lockedTpa: computed(() => state.lockedTpa),
  stakedTpa: computed(() => state.stakedTpa),
  tpaData: computed(() => [...state.tpaData]),
  releasableTpa: computed(() => state.releasableTpa),
  walletName: computed(() => state.walletName),
  tpaWindow,
  tpaWindowFirstAmount: computed(() => {
    const window = tpaWindow.value;
    return (window.length > 0) ? window[0].staked : 0;
  }),
  tpaWindowLastAmount,
  initialStakedTpa: computed(() => {
    const tpa = state.tpaData;
    if(!tpa || !tpa.length) {
      return 0;
    }
    return tpa[0].staked;
  }),
  // Only care about possible pending TX from the last week
  latestTx: computed(() => {
    const tx = state.txHistory[0];
    if(tx) {
      const weekMs = DAY_MS * 7;
      if(new Date().getTime() - tx.timestamp < weekMs) {
        return tx;
      }
    }
    return null;
  }),
  setWalletName: (name) => {
    state.walletName = name;
  },
  setAddress: (address) => {
    state.address = address;
  },
  setTimeIndex: (index) => {
    state.timeIndex = index;
  },
  setUserTpa: (tpa) => {
    state.userTpa = tpa;
  },
  setUserStaked: (tpa) => {
    state.stakedTpa = tpa;
    updateTpaData(tpa);
  },
  setUserLocked: (tpa) => {
    state.lockedTpa = tpa;
  },
  setUserReleasable: (tpa) => {
    state.releasableTpa = tpa;
  },
  setUserAdmin: (admin) => {
    state.admin = admin;
  },
  addTx: (tx) => {
    state.txHistory.unshift(tx);
    state.txHistory = state.txHistory.slice(0, TX_HISTORY_LIMIT);
  },
  updateLatestTx: (tx) => {
    state.txHistory[0] = tx;
  },
  clearState: () => {
    Object.assign(state, initialState());
  },
});
