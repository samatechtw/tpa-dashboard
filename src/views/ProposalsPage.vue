<template>
<div class="proposals-wrap">
  <Header />
  <ProposalsHeader />
  <Proposals />
  <ConnectModal />
</div>
</template>

<style lang="postcss">
@import '/src/assets/css/global.css';

.proposals-wrap {
  background-color: $grey1;
  padding-bottom: 80px;
  min-height: 100%;
}
</style>
