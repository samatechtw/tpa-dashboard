<template>
<span>
  {{ activeText }}
  <Spinner v-if="loading || !text" />
</span>
</template>

<script>
import { toRefs, computed } from 'vue';

export default {
  props: {
    text: {
      type: String,
      default: null,
    },
    loading: Boolean,
  },
  setup(props) {
    const { text, loading } = toRefs(props);
    return {
      activeText: computed(() => {
        if(loading.value) {
          return null;
        }
        return text.value || ' ';
      }),
    };
  },
};
</script>

<style lang="postcss">

</style>
