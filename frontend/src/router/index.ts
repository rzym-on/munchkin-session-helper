import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    children: [
      {
        path: '',
        name: 'Room',
        component: () => import('../views/Room.vue'),
      },
      {
        path: '/game',
        name: 'Game',
        component: () => import('../views/Game.vue'),
      },
    ],
  },
  {
    path: '/watch',
    name: 'Watch',
    component: () => import('../views/Watch.vue'),
  },
  {
    path: '/spectate',
    name: 'Spectate',
    component: () => import('../views/Spectate.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
