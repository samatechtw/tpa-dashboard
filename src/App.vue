<template>
<router-view />
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="postcss">
@import './assets/css/font.css';
@import './assets/css/global.css';

html,body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  color: $black;
  background-color: $white;
  * {
    box-sizing: border-box;
  }
}

.box {
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: white;
}

.tpa-button {
  @mixin semibold 15px;
  background-color: $blue;
  color: white;
  border-radius: 4px;
  padding: 8px 32px;
  cursor: pointer;
}
.tpa-error {
  @mixin medium 11px;
  color: $red;
  margin-top: 8px;
}

.home-wrap {
  background-color: $grey1;
  color: $black;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width: 640px) {
    height: 100%;
    padding-bottom: 40px;
  }
}

.anchor {
  position: absolute;
  top: -120px;
}

a {
  text-decoration: none;
}

#app {
  height: 100%;
}

.blue-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  background-color: $blue;
}

.tpa-empty {
  width: 100%;
  flex-grow: 1;
  @mixin flex-center;
  @mixin medium 16px;
  color: $text-light;
}

.container {
  max-width: 1100px;
  box-sizing: border-box;
  padding-left: 40px;
  padding-right: 40px;
  margin: 0 auto;
}
@media (max-width: 900px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>
