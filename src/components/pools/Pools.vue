<template>
<div class="pools-wrap container">
  <div class="blue-bg" />
  <PoolsHeader :keys="['dashboard', 'pools.title']" />
  <div class="pools-title">
    {{ $t('pools.list') }}
  </div>
  <div class="pools">
    <div
      v-for="pool in pools"
      :key="pool.id"
      class="pool"
      @click="$router.push({ name: 'Pool', params: { id: pool.id } })"
    >
      <div class="pool-title-wrap">
        <img :src="pool.image">
          <div class="pool-title">
          <div class="pool-label">
            {{ pool.tokens.join('/') }}
          </div>
          <div class="pool-data">
            {{ pool.name }}
          </div>
        </div>
      </div>
      <div class="pool-growth">
        <div class="pool-label">
          {{ $t('pools.yearly') }}
        </div>
        <div class="pool-data">
          {{ pool.growth }}
        </div>
      </div>
      <div class="pool-available">
        <div class="pool-label">
          {{ $t('pools.available') }}
        </div>
        <div class="pool-data">
          {{ `${pool.available} ${pool.deposit.join('+')}` }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    pools: {
      type: Array,
      require: true,
    },
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pools-wrap {
  width: 100%;
  .pools-title {
    @mixin title 26px;
    color: white;
    position: relative;
    text-align: center;
    margin-top: 64px;
  }
  .pools {
    position: relative;
  }
  .pool {
    display: flex;
    width: 100%;
    max-width: 800px;
    align-items: center;
    padding: 20px 24px;
    border: 1px solid $border1;
    background-color: white;
    margin: 16px auto 0;
    cursor: pointer;
  }
  .pool-title-wrap {
    display: flex;
    align-items: center;
    > img {
      width: 33px;
      margin-right: 16px;
    }
  }
  .pool-label {
    @mixin semibold 10px;
    color: $text-light;
  }
  .pool-data {
    @mixin title 18px;
    color: black;
    margin-top: 8px;
  }
  .pool-title {
    width: 300px;
  }
  .pool-growth {
    width: 240px;
  }
  @media (max-width: 900px) {
    .pool-growth {
      width: 140px;
    }
  }
  @media (max-width: 750px) {
    .pool {
      flex-wrap: wrap;
      justify-content: space-around;
    }
    .pool-title-wrap {
      width: 100%;
      justify-content: center;
    }
    .pool-growth, .pool-available {
      margin-top: 16px;
    }
  }
}

</style>
