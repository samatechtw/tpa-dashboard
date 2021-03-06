<template>
<div class="dashboard-wrap">
  <div class="dashboard container">
    <RecentTx :tx="latestTxData" />
    <Admin v-if="isUserAdmin" />
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
        <div class="staked-right">
          <img :src="Graph">
          <div v-if="userTotal > 0" class="unstake" @click="showUnstakeModal = true">
            <span>{{ $t('unstake') }}</span>
          </div>
        </div>
      </div>
      <div class="dashboard-stake box">
        <div class="stake-left">
          <div class="stake-left-section">
            <div class="stake-left-amount">
              {{ userTpaStr }}
            </div>
            <div class="stake-left-text">
              {{ $t('unstaked') }}
            </div>
          </div>
          <div v-if="lockedTpa" class="stake-left-section">
            <div class="stake-left-amount">
              {{ userLockedTpaStr }}
            </div>
            <div class="stake-left-text">
              <span>{{ $t('locked') }}</span>
              <span
                class="unlock-link"
                @click="showUnlockModal = true"
              >{{ $t('unlock') }}
              </span>
            </div>
          </div>
        </div>
        <div class="stake-right">
          <div class="tpa-button" @click="showStakeModal = true">
            {{ $t('stake') }}
          </div>
          <div class="stake-get">
            <a v-if="purchaseExternal" :href="purchaseLink" target="_blank">
              <span>{{ $t('get') }}</span>
            </a>
            <router-link v-else :to="purchaseLink">
              <span>{{ $t('get') }}</span>
            </router-link>
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
  <StakeModal
    :show="showStakeModal"
    @cancel="showStakeModal = false"
  />
  <UnstakeModal
    :show="showUnstakeModal"
    @cancel="showUnstakeModal = false"
  />
  <UnlockModal
    :show="showUnlockModal"
    @cancel="showUnlockModal = false"
  />
</div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from '/src/store';
import { useI18n } from 'vue-i18n';
import useChain from '/src/chain/useChain';
import {
  PURCHASE_LINK,
  purchaseExternal,
} from '/src/utils/config';

const sign = val => (val >= 0) ? '+' : '';
const signClass = val => (val >= 0) ? 'positive' : 'negative';
const signedStr = val => `${sign(val)}${val.toLocaleString()}`;

export default {
  name: 'dashboard',
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const {
      isUserAdmin,
      latestTx,
      userTpa,
      lockedTpa,
      tpaWindow,
      timeIndex,
      initialStakedTpa,
      stakedTpa,
      tpaWindowFirstAmount,
      tpaWindowLastAmount,
    } = store;
    const { toEth, toEthDisplay } = useChain(store, t);
    const showStakeModal = ref(false);
    const showUnstakeModal = ref(false);
    const showUnlockModal = ref(false);

    const userDiff = computed(() => Number(toEth(stakedTpa.value)) - initialStakedTpa.value);
    const userTotalStr = computed(() => (
      toEthDisplay(stakedTpa.value)
    ));
    const userDiffStr = computed(() => signedStr(userDiff.value));
    const userPercentStr = computed(() => {
      if(initialStakedTpa.value === 0) {
        return 0;
      }
      return (100 * (userDiff.value / initialStakedTpa.value)).toFixed(3);
    });
    const allTimeSign = computed(() => signClass(userDiff.value));

    const userLockedTpaStr = computed(() => toEthDisplay(lockedTpa.value));
    const userTpaStr = computed(() => toEthDisplay(userTpa.value));
    const graphDiffStr = computed(() => (
      signedStr(toEth(tpaWindowLastAmount.value) - toEth(tpaWindowFirstAmount.value))
    ));
    const graphPercent = computed(() => {
      const first = tpaWindowFirstAmount.value;
      const last = tpaWindowLastAmount.value;
      if(first === last || first === 0) {
        return 0;
      }
      return (100 * ((last - first) / first)).toFixed(3);
    });
    const graphPercentStr = computed(() => signedStr(graphPercent.value));
    const graphPercentSign = computed(() => signClass(graphPercent.value));

    const latestTxData = computed(() => {
      const hourAgo = new Date().getTime() - (1000 * 60 * 60);
      const tx = latestTx.value;
      if(tx && (tx.timestamp > hourAgo)) {
        return tx;
      }
      return null;
    });

    return {
      store,
      isUserAdmin,
      showStakeModal,
      showUnstakeModal,
      showUnlockModal,
      userTotalStr,
      userTotal: stakedTpa,
      userDiffStr,
      userPercentStr,
      userTpaStr,
      userLockedTpaStr,
      lockedTpa,
      allTimeSign,
      timeIndex,
      tpaWindow,
      graphDiffStr,
      graphPercentStr,
      graphPercentSign,
      purchaseExternal,
      purchaseLink: PURCHASE_LINK,
      latestTxData,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.dashboard-wrap {
  padding-bottom: 40px;
  background-color: $grey1;
}
.dashboard {
  .positive {
    color: $green;
  }
  .negative {
    color: $red;
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
      .staked-right {
        margin-left: auto;
        .unstake {
          cursor: pointer;
          @mixin semibold 11px;
          color: $orange;
          border-bottom: 1px solid $orange;
        }
        img {
          width: 48px;
        }
      }
    }
    .dashboard-stake {
      width: 42%;
      min-width: 320px;
      margin-left: 24px;
      display: flex;
      align-items: center;
      padding-right: 40px;
      .stake-left {
        display: flex;
        flex-direction: column;
        .stake-left-amount {
          @mixin title 19px;
        }
        .stake-left-text {
          color: $dark3;
          @mixin semibold 12px;
          .unlock-link {
            margin-left: 6px;
            cursor: pointer;
            color: $red;
          }
        }
        .stake-left-section:not(:first-child) {
          margin-top: 8px;
        }
      }
      .stake-right {
        margin-left: auto;
        .stake-get {
          margin-top: 6px;
          text-align: center;
          span {
            border-bottom: 1px solid $orange;
            @mixin semibold 11px;
            color: $orange;
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
  @media (max-width: 640px) {
    .dashboard-top {
      flex-wrap: wrap;
      .dashboard-stake, .dashboard-staked {
        width: 100%;
      }
      .dashboard-stake {
        margin-top: 24px;
        margin-left: 0;
      }
    }
  }
}
</style>
