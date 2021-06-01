import { createRouter, createWebHistory } from 'vue-router';
import Home from '/src/views/Home.vue';
import ProposalsPage from '/src/views/ProposalsPage.vue';
import Faucet from '/src/views/Faucet.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'TPA Dashboard' },
    },
    {
      path: '/proposals',
      name: 'Proposals',
      component: ProposalsPage,
      meta: { title: 'Proposals' },
    },
    {
      path: '/get',
      name: 'Faucet',
      component: Faucet,
      meta: { title: 'TPA Test Faucet' },
    },
  ],
});

router.afterEach((to, _from) => {
  const parentTitle = to.matched.some(record => record.meta.title);
  document.title = to.meta.title || parentTitle || 'TPA Dashboard';
});

export default router;
