<template>
<div v-if="comments" class="comments-wrap container">
  <div class="comments-title-wrap">
    <div class="comments-title">
      {{ $t('comments.count', comments.length) }}
    </div>
  </div>
  <div class="comments-enter-wrap">
    <div v-if="walletConnected" class="comment-enter">
      {{ $t('comments.enter') }}
    </div>
    <div v-else class="comments-connect">
      {{ $t('comments.connect') }}
    </div>
  </div>
  <div class="comments">
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="comment"
    >
      <img :src="comment.author.image">
      <div class="comment-text-wrap">
        <div class="comment-author">
          {{ comment.author.name }}
        </div>
        <div class="comment-text" v-html="comment.text" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useStore } from '/src/store';
import useChain from '/src/chain/useChain';

export default {
  props: {
    comments: {
      type: Array,
      default: null,
    },
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const {
      walletConnected,
    } = useChain(store, t);
    
    return {
      walletConnected,
    };    
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

$width1: 640px;
$width2: 584px;
$left1: 160px;
$left2: 104px;

.comments-wrap {
  margin-top: 48px;
  .comments-title-wrap {
    border-bottom: 1px solid $border1;
  }
  .comments-title {
    max-width: $width1;
    margin-left: 120px;
    @mixin semibold 12px;
    color: $text-light;
    padding-bottom: 8px;
  }
  .comments-enter-wrap {
    margin-top: 32px;
    @mixin semibold 15px;
    color: $text-light;
    display: flex;
    max-width: $width1;
    margin: 32px 0 32px $left1;
    > div {
      max-width: $width2;
      width: $width2;
      border-bottom: 1px solid $border1;
      padding-bottom: 4px;
    }
  }
  .comments {
    display: flex;
    margin: 16px 0 0 $left2;
    max-width: $width1;
    flex-direction: column;
    .comment {
      display: flex;
      padding: 24px 0 32px;
      > img {
        width: 43px;
        height: 43px;
        margin-right: 13px;
      }
      &:not(:first-child) {
        border-top: 1px solid $border1;
      }
    }
    .comment-text-wrap {
      color: $dark2;
    }
    .comment-author {
      @mixin semibold 15px;
    }
    .comment-text {
      @mixin text 15px;
      margin-top: 24px;
    }
  }
}
</style>
