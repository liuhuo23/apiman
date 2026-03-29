import { createRouter, createWebHistory } from 'vue-router';
import ProjectView from '../views/ProjectView.vue';
import ApiListView from '../views/ApiListView.vue';
import ApiDetailView from '../views/ApiDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'projects',
      component: ProjectView,
    },
    {
      path: '/project/:id',
      name: 'api-list',
      component: ApiListView,
    },
    {
      path: '/project/:id/api/:apiId',
      name: 'api-detail',
      component: ApiDetailView,
    },
  ],
});

export default router;
