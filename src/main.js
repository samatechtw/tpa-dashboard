import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';
import clickaway from './utils/clickaway';

createApp(App)
  .use(router)
  .use(i18n)
  .directive('clickaway', clickaway)
  .mount('#app');
