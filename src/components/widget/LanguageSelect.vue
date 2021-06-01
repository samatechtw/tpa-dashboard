<template>
<div class="language-select">
  <div
    v-for="(lang, index) in $tm('languages')"
    :key="lang"
    class="language"
    :class="{ active: lang === language }"
    @click="setLanguage(lang)"
  >
    <img :src="languageIcons[index]">
    <div>{{ lang }}</div>
  </div>
</div>
</template>

<script>
import { useStore } from '/src/store';
import IcUs from '/src/assets/img/ic_us.svg';
import IcKo from '/src/assets/img/ic_ko.svg';

export default {
  setup() {
    const { language, setLanguage } = useStore();
    return {
      language,
      setLanguage,
      languageIcons: [IcUs, IcKo],
    };
  },
};
</script>

<style lang="postcss">
@import '/src/assets/css/global.css';

.language-select {
  display: flex;
  color: $dark2;
  @mixin medium 15px;
  margin-right: 8px;
  .language {
    display: flex;
    cursor: pointer;
    margin-right: 16px;
    align-items: center;
    &.active {
      text-decoration: underline;
    }
    img {
      width: 15px;
      height: 15px;
      margin-right: 6px;
    }
  }
}

</style>
