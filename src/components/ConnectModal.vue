<template>
<Modal :show="showConnect" @cancel="$emit('cancel')">
  <div class="connect-modal modal-content">
    <div class="connect-title">
      {{ $t('select.title') }}
    </div>
    <div class="connect-text">
      {{ $t('select.text') }}
    </div>
    <div class="connect-options">
      <div
        class="metamask option-button"
        :class="{ selected: selected === 'metamask' }"
        @click="selected = 'metamask'"
      >
        <img :src="Metamask">
        <div>{{ $t('select.metamask') }}</div>
      </div>
      <div
        class="walletconnect option-button"
        :class="{ selected: selected === 'walletconnect' }"
        @click="selected = 'walletconnect'"
      >
        <img :src="Walletconnect">
        <div>{{ $t('select.walletconnect') }}</div>
      </div>
    </div>
    <div v-if="connectError" class="connect-error">
      {{ connectError }}
    </div>
    <div class="connect-button-wrap">
      <div class="connect-button" @click="connectWallet(selected)">
        {{ $t('select.connect') }}
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';

export default {
  name: 'connect-modal',
  emits: ['cancel'],
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const { address } = store;
    const {
      connectError,
      connectWallet,
      reconnectWallet,
      showConnect,
    } = useChain(store, t);
    const selected = ref('metamask');

    onBeforeMount(async () => {
      if(address.value) {
        await reconnectWallet();
      }
    });
    
    return {
      connectError,
      address,
      connectWallet,
      showConnect,
      selected,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.connect-modal {
  .connect-title {
    @mixin title 18px;
  }
  .connect-text {
    @mixin text 15px;
    margin-top: 4px;
  }
  .connect-options {
    display: flex;
    margin-top: 24px;
    padding: 0 16px;
  }
  .option-button {
    display: flex;
    @mixin text 14px;
    letter-spacing: -0.2px;
    width: 200px;
    height: 60px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    padding: 0 12px 0 16px;
    cursor: pointer;
    border: 1px solid $grey3;
    &:hover {
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    }
    &.selected {
      box-shadow: none;
      border: 2px solid $blue;
    }
    > div {
      margin-top: 1px;
      display: flex;
      align-items: center;
    }
    img {
      width: auto;
      margin-right: 8px;
    }
  }
  .metamask {
    margin-right: 8px;
    > img {
      height: 34px;
    }
  }
  .walletconnect {
    margin-left: 8px;
    > img {
      height: 22px;
    }
  }
  .connect-error {
    @mixin medium 11px;
    color: $red;
    margin-top: 8px;
    text-align: center;
  }
  .connect-button-wrap {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
  .connect-button {
    @mixin title 15px;
    color: white;
    background-color: $blue;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  @media (max-width: 600px) {
    width: auto;
    .connect-options {
      flex-wrap: wrap;
      padding: 0;
      justify-content: center;
    }
    .connect-button {
      min-width: unset;
      margin: 0;
    }
    .metamask {
      margin-right: 0;
    }
    .walletconnect {
      margin-top: 16px;
      margin-left: 0;
    }
  }
}
</style>
