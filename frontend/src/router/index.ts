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
        path: 'room',
        name: 'Room',
        component: () => import('../views/Room.vue'),
      },
      {
        path: 'add-viewer',
        name: 'AddViewer',
        component: () => import('../views/AddViewer.vue'),
      },
    ],
  },
  {
    path: '/watch',
    name: 'Watch',
    component: () => import('../views/Watch.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
