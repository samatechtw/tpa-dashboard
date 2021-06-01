<template>
<div class="proposals container">
  <div class="proposals-title">
    {{ $t('proposals.title') }}
  </div>
  <div class="proposals-filters">
    <div
      v-for="filter in $tm('proposals.filters')"
      :key="filter"
      class="proposals-filter"
      :class="{ active: activeFilter === filter }"
      @click="setFilter(filter)"
    >
      {{ filter }}
    </div>
  </div>
  <div
    v-for="proposal in proposals"
    :key="proposal.id"
    class="proposal"
    @click="$router.push({ name: 'Proposal', params: { id: proposal.id } })"
  >
    <div class="proposal-title-wrap">
      <div class="proposal-status" :class="proposal.status">
        {{ proposal.status }}
      </div>
      <div class="proposal-title">
        {{ proposal.title }}
      </div>
    </div>
    <div class="proposal-data">
      <div class="proposal-label">
        {{ proposal.label }}
      </div>
      <div class="proposal-address">
        {{ $t('proposals.address', { address: proposalAddress(proposal.author.address) }) }}
      </div>
      <div class="proposal-start">
        {{ $t('proposals.start', { date: proposalDate(proposal.start) }) }}
      </div>
      <div class="proposal-end">
        {{ $t('proposals.end', { date: proposalDate(proposal.end) }) }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { getProposals } from '/src/utils/api';

export default {
  setup() {
    const proposals = ref([]);
    const activeFilter = ref('All');
    const updateProposals = () => {
      proposals.value = getProposals(activeFilter.value);
    };
    const setFilter = (filter) => {
      activeFilter.value = filter;
      updateProposals();
    };
    const proposalDate = date => (
      format(date, 'm/d/YYY')
    );
    const proposalAddress = address =>  {
      const len = address.length;
      return `${address.slice(0, 5)}...${address.slice(len - 3, len)}`;
    };
    onMounted(updateProposals);
    return {
      proposals,
      activeFilter,
      setFilter,
      proposalDate,
      proposalAddress,
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.proposals {
  .proposals-title {
    @mixin title 26px;
    color: $dark3;
    margin-top: 16px;
  }
  .proposals-filters {
    margin-top: 32px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    @mixin semibold 13px;
    color: $text-light;
    display: flex;
    padding: 19px 0 16px 8px;
    background-color: white;
    border: 1px solid $border1;
    border-bottom: none;
  }
  .proposals-filter {
    cursor: pointer;
    margin-left: 20px;
    user-select: none;
    &.active {
      color: $dark2;
    }
  }
  .proposal {
    padding: 20px 16px 16px 24px;
    border: 1px solid $border1;
    cursor: pointer;
    transition: all 0.25s ease;
    &:not(:last-child) {
      border-bottom: none;
    }
  }
  .proposal-title-wrap {
    display: flex;
    .proposal-status {
      height: 17px;
      padding: 0 10px;
      @mixin flex-center;
      @mixin semibold 8px;
      color: white;
      border-radius: 8.5px;
      background-color: $blue;
      margin-top: 2px;
      letter-spacing: 0.55px;
    }
    .proposal-title {
      @mixin title 18px;
      color: black;
      margin-left: 8px;
    }
  }
  .proposal:hover {
    background-color: $border1;
    .proposal-title-wrap .proposal-title {
      color: $blue;
    }
  }
  .proposal-data {
    display: flex;
    @mixin semibold 11px;
    color: $text-light;
    margin-top: 12px;
    > div:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
