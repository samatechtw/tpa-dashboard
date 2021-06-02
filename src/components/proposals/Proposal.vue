<template>
<div v-if="proposal" class="proposal-content container">
  <div class="proposal-title">
    {{ proposal.title }}
  </div>
  <div class="proposal-data">
    <div class="proposal-author">
      <img :src="proposal.author.image">
      <div class="author-text">
        <div class="author-label">
          {{ $t('proposals.author') }}
        </div>
        <div>{{ proposal.author.name }}</div>
      </div>
    </div>
    <div class="proposal-description" v-html="proposal.description" />
  </div>
</div>
</template>

<script>
export default {
  props: {
    proposal: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.proposal-content {
  .proposal-title {
    @mixin title 26px;
    color: $dark3;
    padding-bottom: 24px;
    border-bottom: 1px solid $border1;
    margin-top: 8px;
  }
  .proposal-data {
    display: flex;
    padding-top: 32px;
  }
  .proposal-author {
    min-width: 140px;
    margin-right: 16px;
    display: flex;
    @mixin semibold 15px;
    color: $dark2;
    img {
      width: 43px;
      height: 43px;
      margin-right: 6px;
    }
    .author-label {
      @mixin title 10px;
      color: $text-light;
    }
  }
  .proposal-description {
    @mixin text 15px;
    color: $dark2;
    max-width: 550px;
  }
}

</style>
