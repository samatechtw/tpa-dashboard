<template>
<div class="pools-header">
  <div
    v-for="(key, idx) in keys"
    :key="key"
    class="pools-header-item"
    @click="$router.push({ name: links[key] })"
  >
    <div v-if="idx !== 0">
      >
    </div>
    <div>{{ $t(key) }}</div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    keys: {
      type: Array,
      default: () => ([]),
    },
  },
  setup() {
    return {
      links: {
        'dashboard': 'Home',
        'pools.title': 'Pools',
        'pools.earn': 'Pool',
      },
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.pools-header {
  display: flex;
  margin-top: 40px;
  position: relative;
  .pools-header-item {
    @mixin medium 15px;
    color: #0b567c;
    display: flex;
    cursor: pointer;
    user-select: none;
    > div {
      margin-right: 8px;
    }
    &:last-child {
      color: white;
      cursor: default;
      > div:last-child {
        margin-right: 0;
        border-bottom: 1px solid white;
      }
    }
  }
}

</style>
