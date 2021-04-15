<template>
<div class="dashboard-wrap">
  <div class="dashboard container">
    <div class="dashboard-top">
      <div class="dashboard-staked box">
        <div class="staked-left">
          <div class="staked-value">
            {{ $t('tpa_amount', { amount: userTotalStr }) }}
          </div>
          <div class="staked-diff">
            <span :class="allTimeSign">
              {{ $t('tpa_interest', { diff: userDiffStr, percent: userPercentStr }) }}
            </span>
            <span class="staked-diff-text">{{ $t('all_time') }}</span>
          </div>
        </div>
        <img :src="Graph">
      </div>
      <div class="dashboard-stake box">
        <div class="stake-left">
          <div class="stake-unstaked">
            {{ userTpaStr }}
          </div>
          <div class="stake-unstaked-text">
            {{ $t('unstaked') }}
          </div>
        </div>
        <div class="stake-right">
          <div class="stake-button">
            {{ $t('stake') }}
          </div>
          <div class="stake-get">
            <span>{{ $t('get') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-graph box">
      <div class="graph-top">
        <div class="graph-title">
          {{ $t('pool') }}
        </div>
        <div class="graph-time-dropdown">
          <div class="graph-time-text">
            {{ $t('duration') }}
          </div>
          <GraphDropdown
            :index="timeIndex"
            :labels="$tm('time').map(s => s.label)"
            @select="store.setTimeIndex($event)"
          />
        </div>
      </div>
      <div class="graph-data">
        <div class="graph-diff">
          {{ $t('tpa_amount', { amount: graphDiffStr }) }}
        </div>
        <div class="graph-change">
          <span :class="graphPercentSign">
            {{ $t('graph_percent', { percent: graphPercentStr}) }}
          </span>
          <span class="graph-change-text">{{ $t('change') }}</span>
        </div>
      </div>
      <Graph :points="tpaWindow" />
      <div class="graph-time">
        <div
          v-for="(short, index) in $tm('time').map(s => s.short)"
          :key="index"
          :class="{ active: index === timeIndex }"
          @click="store.setTimeIndex(index)"
        >
          {{ short }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed } from 'vue';
import storeSetup from '/src/store';

const sign = val => (val >= 0) ? '+' : '';
const signClass = val => (val >= 0) ? 'positive' : 'negative';
const signedStr = val => `${sign(val)}${val.toLocaleString()}`;

export default {
  name: 'dashboard',
  setup() {
    const store = storeSetup();
    const {
      userTpa,
      tpaWindow,
      timeIndex,
      initialStakedTpa,
      stakedTpa,
      tpaWindowFirstAmount,
      tpaWindowLastAmount,
    } = store;
    const userDiff = computed(() => stakedTpa.value - initialStakedTpa.value);
    const userTotalStr = computed(() => (
      stakedTpa.value.toLocaleString()
    ));
    const userDiffStr = computed(() => signedStr(userDiff.value));
    const userPercentStr = computed(() => {
      if(initialStakedTpa.value === 0) {
        return 0;
      }
      return (userDiff.value / initialStakedTpa.value).toFixed(2);
    });
    const allTimeSign = computed(() => signClass(userDiff.value));

    const userTpaStr = computed(() => userTpa.value.toLocaleString());
    const graphDiffStr = computed(() => (
      signedStr(tpaWindowLastAmount.value - tpaWindowFirstAmount.value)
    ));
    const graphPercent = computed(() => {
      const first = tpaWindowFirstAmount.value;
      const last = tpaWindowLastAmount.value;
      if(first === last || first === 0) {
        return 0;
      }
      return (last - first) / first;
    });
    const graphPercentStr = computed(() => signedStr(graphPercent.value));
    const graphPercentSign = computed(() => signClass(graphPercent.value));
    return {
      store,
      userTotalStr,
      userDiffStr,
      userPercentStr,
      userTpaStr,
      allTimeSign,
      timeIndex,
      tpaWindow,
      graphDiffStr,
      graphPercentStr,
      graphPercentSign,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.dashboard {
  .positive {
    color: $green;
  }
  .negative {
    color: $red;
  }
  .box {
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    background-color: white;
  }
  .dashboard-top {
    margin-top: 24px;
    display: flex;
    width: 100%;
    > div {
      height: 112px;
      padding: 0 24px;
    }
    .dashboard-staked {
      width: 58%;
      display: flex;
      align-items: center;
      .staked-left {
        display: flex;
        flex-direction: column;
      }
      .staked-value {
        @mixin title 19px;
      }
      .staked-diff {
        @mixin semibold 11px;
        margin-top: 6px;
        .staked-diff-text {
          @mixin text 10px;
        }
      }
      img {
        margin-left: auto;
        width: 48px;
      }
    }
    .dashboard-stake {
      width: 42%;
      margin-left: 24px;
      display: flex;
      padding-top: 36px;
      padding-right: 40px;
      .stake-left {
        display: flex;
        flex-direction: column;
        .stake-unstaked {
          @mixin title 19px;
        }
        .stake-unstaked-text {
          color: $dark3;
          @mixin semibold 12px;
        }
      }
      .stake-right {
        margin-left: auto;
        .stake-button {
          @mixin semibold 15px;
          background-color: $blue;
          color: white;
          border-radius: 4px;
          padding: 8px 32px;
          cursor: pointer;
        }
        .stake-get {
          @mixin semibold 11px;
          color: $orange;
          margin-top: 6px;
          text-align: center;
          > span {
            border-bottom: 1px solid $orange;
            cursor: pointer;
          }
        }
      }
    }
  }
  .dashboard-graph {
    margin-top: 24px;
    padding: 24px 40px 32px;
    .graph-top {
      display: flex;
      .graph-title {
        @mixin title 16px;
        color: $dark3;
      }
      .graph-time-dropdown {
        margin-left: auto;
        display: flex;
        .graph-time-text {
          @mixin title 14px;
        }
      }
    }
    .graph-data {
      display: flex;
      margin-top: 32px;
      .graph-diff {
        @mixin title 18px;
        padding-right: 32px;
        border-right: 1px solid $grey3;
      }
      .graph-change {
        @mixin title 18px;
        padding-left: 32px;
        .graph-change-text {
          font-size: 12px;
          color: $dark3;
          margin-left: 8px;
        }
      }
    }
    .graph-time {
      @mixin text 12px;
      display: flex;
      justify-content: center;
      margin-top: 12px;
      > div {
        cursor: pointer;
        margin: 0 24px;
        &.active {
          color: $blue;
          text-decoration: underline;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
