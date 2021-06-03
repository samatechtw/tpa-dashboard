import { createRouter, createWebHistory } from 'vue-router';
import Home from '/src/views/Home.vue';
import ProposalsPage from '/src/views/ProposalsPage.vue';
import ProposalPage from '/src/views/ProposalPage.vue';
import PoolsPage from '/src/views/PoolsPage.vue';
import PoolPage from '/src/views/PoolPage.vue';
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
      path: '/proposals/:id(\\d+)',
      name: 'Proposal',
      component: ProposalPage,
      meta: { title: 'Proposal' },
    },
    {
      path: '/pools',
      name: 'Pools',
      component: PoolsPage,
      meta: { title: 'Pools' },
    },
    {
      path: '/pools/:id(\\d+)',
      name: 'Pool',
      component: PoolPage,
      meta: { title: 'Pool' },
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
