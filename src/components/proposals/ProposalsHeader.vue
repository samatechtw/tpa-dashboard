<template>
<div class="proposals-header container">
  <div v-if="showBack" class="proposals-nav back" @click="$router.push({ name: 'Proposals' })">
    <img :src="Back">
    <div>{{ $t('proposals.back') }}</div>
  </div>
  <div v-else class="proposals-nav">
    {{ $t('proposals.header_default') }}
  </div>
  <div class="proposals-create" @click="showCreate = true">
    {{ $t('proposals.create') }}
  </div>
  <Modal :show="showCreate" @cancel="showCreate = false">
    <div class="modal-content">
      <div class="proposals-create-title">
        {{ $t('proposals.create_title') }}
      </div>
      <div class="proposals-create-text">
        {{ $t('proposals.create_text') }}
      </div>
    </div>
  </Modal>
</div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    showBack: Boolean,
  },
  setup() {
    const showCreate = ref(false);
    return {
      showCreate,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.proposals-header {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  .proposals-nav {
    display: flex;
    align-items: center;
    @mixin text 15px;
    color: $text-light;
    img {
      width: 11px;
      margin-right: 4px;
    }
    &.back {
      cursor: pointer;
      user-select: none;
    }
  }
  .proposals-create {
    @mixin semibold 15px;
    color: $blue;
    user-select: none;
    cursor: pointer;
  }
  .modal-content {
    width: 400px;
  }
  .proposals-create-title {
    @mixin title 22px;
    color: $dark1;
  }
  .proposals-create-text {
    @mixin text 16px;
    color: $dark2;
    margin-top: 24px;
  }
}
</style>
