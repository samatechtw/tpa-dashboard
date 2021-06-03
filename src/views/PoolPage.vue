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
import { useRoute } from 'vue-router';
import { getPool } from '/src/utils/api';

export default {
  setup() {
    const pool = ref(null);
    const route = useRoute();

    onMounted(() => {
      pool.value = getPool(parseInt(route.params.id));
    });

    return {
      pool,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pool-page {
  background-color: $grey1;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
