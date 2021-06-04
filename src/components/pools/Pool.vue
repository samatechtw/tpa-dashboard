<template>
<div class="pool-wrap container">
  <div class="blue-bg" />
  <PoolsHeader :keys="['dashboard', 'pools.title', 'pools.earn']" />
  <div class="pool-title">
    {{ $t('pools.earn') }}
  </div>
  <div class="pool-subtitle">
    {{ $t('pools.staking') }}
  </div>
  <div class="pool">
    <div class="pool-name">
      {{ pool.name }}
    </div>
    <div class="pool-stake">
      {{ $t('pools.stake', { deposit: pool.deposit.join('/'), receive: pool.receive.join('/') }) }}
    </div>
    <img :src="pool.image">
    <div class="pool-info">
      <div class="pool-section">
        <div>{{ $t('pools.apy') }}</div>
        <div>{{ pool.apy }}</div>
      </div>
      <div class="pool-section">
        <div>{{ $t('pools.total') }}</div>
        <div>{{ $t('pools.lp', { n: pool.total_staked}) }}</div>
      </div>
      <div class="pool-section">
        <div>{{ $t('pools.tvl') }}</div>
        <div>{{ $t('pools.eth', { n: pool.tvl }) }}</div>
      </div>
      <div class="pool-section">
        <div>{{ $t('pools.price') }}</div>
        <div>{{ $t('pools.eth', { n: pool.price }) }}</div>
      </div>
      <div class="pool-select" @click="confirm = true">
        {{ $t('pools.select') }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
  setup() {
    return {
      confirm,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pool-wrap {
  text-align: center;
  width: 100%;
  .pool-title {
    @mixin title 26px;
    color: white;
    position: relative;
    margin-top: 40px;
  }
  .pool-subtitle {
    @mixin text 15px;
    color: white;
    margin-top: 16px;
    position: relative;
  }
  .pool {
    position: relative;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.2);
    margin: 40px auto 0;
    padding: 32px 24px 24px;
    width: 400px;
    text-align: left;
    display: flex;
    flex-direction: column;
    > img {
      width: 78px;
      margin: 24px 0;
      align-self: center;
    }
  }
  .pool-name {
    @mixin title 17px;
    color: black;
    padding-bottom: 12px;
    border-bottom: 1px solid $border1;
  }
  .pool-stake {
    @mixin semibold 12px;
    color: $dark3;
    margin-top: 16px;
  }
  .pool-section {
    display: flex;
    justify-content: space-between;
    @mixin semibold 12px;
    color: $text-light;
    padding: 14px 0;
    border-bottom: 1px solid $border1;
  }
  .pool-select {
    cursor: pointer;
    @mixin semibold 15px;
    @mixin flex-center;
    margin-top: 24px;
    color: $blue;
    border: 2px solid $blue;
    border-radius: 4px;
    height: 40px;
  }
}

</style>
