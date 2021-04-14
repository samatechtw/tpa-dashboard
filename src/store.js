import { reactive, computed, watch } from 'vue';
import { sub, add } from 'date-fns';

const storeName = 'dashboard-store';

const timeDiffs =[
  { weeks: 1 },
  { months: 1},
  { months: 3 },
  { years: 1 },
  { years: 100 },
];

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

const state = reactive(
  localStorage.getItem(storeName)
    ? JSON.parse(localStorage.getItem(storeName))
    : {
      address: null,
      updated: (new Date()).getTime(),
      tpaData: initialGraphData(),
      timeIndex: 2,
      userTpa: 482,
    },
);

watch(state, value => localStorage.setItem(storeName, JSON.stringify(value)));

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

export default () => ({
  address: computed(() => state.address),
  timeIndex: computed(() => state.timeIndex),
  userTpa: computed(() => state.userTpa),
  tpaData: computed(() => [...state.tpaData]),
  tpaWindow,
  tpaWindowFirstAmount: computed(() => {
    const window = tpaWindow.value;
    return (window.length > 0) ? window[0].staked : 0;
  }),
  tpaWindowLastAmount: computed(() => {
    const window = tpaWindow.value;
    const { length } = window;
    return (length > 0) ? window[length - 1].staked : 0;
  }),
  initialStakedTpa: computed(() => {
    const tpa = state.tpaData;
    if(!tpa || !tpa.length) {
      return 0;
    }
    return tpa[0].staked;
  }),
  stakedTpa: computed(() => {
    const tpa = state.tpaData;
    if(!tpa || !tpa.length) {
      return 0;
    }
    return tpa[tpa.length - 1].staked;
  }),
  setAddress: (address) => {
    state.address = address;
  },
  setTimeIndex: (index) => {
    state.timeIndex = index;
  },
});
