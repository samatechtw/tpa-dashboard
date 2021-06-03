<template>
<div class="pool-page">
  <Header />
  <transition name="fade" mode="out-in">
    <Pool v-if="pool" :pool="pool" />
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
