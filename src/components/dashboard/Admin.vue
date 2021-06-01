<template>
<div class="tpa-admin box">
  <div class="tpa-admin-title">
    {{ $t('admin.title') }}
  </div>
  <div class="tpa-admin-actions">
    <div class="tpa-admin-approve">
      <div class="tpa-admin-subtitle">
        {{ $t('admin.approve') }}
      </div>
      <TpaInput
        :modelValue="amountToApprove"
        suffix="TPA"
        :title="$t('stake_modal.placeholder')"
        :placeholder="$t('stake_modal.placeholder')"
        @update:modelValue="setApproveAmount"
      />
      <div v-if="approveError" class="tpa-error">
        {{ approveError }}
      </div>
      <div class="tpa-button" @click="approve">
        <LoadingText :text="$t('approve')" :loading="!!txState.activeApprove" />
      </div>
    </div>
    <div class="tpa-admin-post">
      <div class="tpa-admin-subtitle">
        {{ $t('tx.dividend') }}
      </div>
      <TpaInput
        :modelValue="amountToPost"
        suffix="TPA"
        :title="$t('stake_modal.placeholder')"
        :placeholder="$t('stake_modal.placeholder')"
        @update:modelValue="setPostAmount"
      />
      <div v-if="postError" class="tpa-error">
        {{ postError }}
      </div>
      <div class="tpa-button" @click="post">
        <LoadingText :text="$t('admin.post')" :loading="!!txState.activePost" />
      </div>
    </div>
    <div class="tpa-admin-add">
      <div class="tpa-admin-subtitle">
        {{ $t('admin.add') }}
      </div>
      <TpaInput
        v-model="newAdminAddress"
        suffix="TPA"
        :title="$t('admin.address')"
        :placeholder="$t('admin.address')"
      />
      <div v-if="addAdminError" class="tpa-error">
        {{ addAdminError }}
      </div>
      <div class="tpa-button" @click="addAdmin">
        <LoadingText :text="$t('admin.add_button')" :loading="!!txState.activePost" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useChain from '/src/chain/useChain';
import { useStore, TxStatus, TxType } from '/src/store';

export default {
  props: {
    tx: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const {
      getUserAllowance,
      onLoad,
      getError,
      toWei,
      submitApproval,
      submitDividend,
      submitAddAdmin,
    } = useChain(store, t);
    const { latestTx } = store;
    const allowance = ref(null);
    const amountToPost = ref(0);
    const amountToApprove = ref(0);
    const approveError = ref(null);
    const postError = ref(null);
    const addAdminError = ref(null);
    const newAdminAddress = ref('');

    const allowanceDisplay = computed(() => (
      allowance.value === null ? '?' : allowance.value.toLocaleString()
    ));

    const isTxActive = tx => (
      tx.status === TxStatus.PENDING || tx.status === TxStatus.SUBMITTED
    );

    const setPostAmount = (val) => {
      if(!val) {
        return;
      }
      if(!!val && isNaN(val)) {
        postError.value = t('errors.number');
      } else {
        postError.value = null;
        amountToPost.value = parseInt(val);
      }
    };
    const setApproveAmount = (val) => {
      if(!val) {
        return;
      }
      if(!!val && isNaN(val)) {
        approveError.value = t('errors.number');
      } else {
        approveError.value = null;
        amountToApprove.value = parseInt(val);
      }
    };
    const approve = async () => {
      approveError.value = null;
      try {
        await submitApproval(toWei(amountToApprove.value));
      } catch(e) {
        approveError.value = getError(e);
      }
    };
    const addAdmin = async () => {
      addAdminError.value = null;
      try {
        await submitAddAdmin(newAdminAddress.value);
      } catch(e) {
        addAdminError.value = getError(e);
      }
    };
    const post = async () => {
      postError.value = null;
      try {
        await submitDividend(toWei(amountToPost.value));        
      } catch(e) {
        postError.value = getError(e);
      }
    };
    const txState = computed(() => {
      const tx = latestTx.value;
      if(tx) {
        if(isTxActive(tx)) {
          if(tx.type === TxType.APPROVAL) {
            return {
              activeApproval: tx.hash,
            };
          }
          if(tx.type === TxType.STAKE) {
            return {
              activeStake: tx.hash,
            };
          }
        } else if(tx.type === TxType.APPROVAL && tx.status === TxStatus.COMPLETED) {

        }
      }
      return {};
    });
    const updateAllowance = async () => {
      allowance.value = await getUserAllowance();
    };
    onLoad(async () => {
      await updateAllowance();
    });
    return {
      addAdminError,
      postError,
      approveError,
      newAdminAddress,
      amountToPost,
      amountToApprove,
      approve,
      post,
      addAdmin,
      txState,
      setPostAmount,
      setApproveAmount,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.tpa-admin {
  padding: 20px 64px 20px 48px;
  width: 100%;
  margin-top: 16px;
  text-align: center;
  .tpa-admin-title {
    @mixin title 18px;
  }
  .tpa-admin-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    > div {
      display: flex;
      flex-direction: column;
      .tpa-button {
        align-self: center;
      }
    }
    > div:not(:last-child) {
      margin-right: 16px;
    }
  }
  .tpa-admin-add {
    width: 50%;
  }
  .tpa-admin-subtitle {
    @mixin semibold 15px;
    color: $text-light;
  }
}
</style>
