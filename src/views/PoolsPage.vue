<template>
<div class="pools-page">
  <Header />
  <transition name="fade" mode="out-in">
    <Pools v-if="pools" :pools="pools" />
    <div v-else class="tpa-empty">
      <Spinner />
    </div>
  </transition>
  <ConnectModal />
</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getPools } from '/src/utils/api';

export default {
  setup() {
    const pools = ref(null);

    onMounted(() => {
      pools.value = getPools();
    });

    return {
      pools,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pools-page {
  background-color: $grey1;
  padding-bottom: 80px;
}
</style>
