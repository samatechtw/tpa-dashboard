<template>
<div class="pool-wrap container">
  <div class="blue-bg" />
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
    <div class="pool-select">
      {{ $t('pools.select') }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    pool: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pool-wrap {
  text-align: center;
  .pool-title {
    @mixin title 26px;
    color: white;
    position: relative;
    margin-top: 64px;
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
    margin-top: 40px;
    padding: 32px 24px 24px;
    width: 420px;
    text-align: left;
    display: flex;
    flex-direction: column;
    > img {
      width: 78px;
      margin-top: 24px;
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
