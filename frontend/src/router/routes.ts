import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'StartPage',
    component: () => import('src/layouts/StartPage.vue'),
  },
  {
    path: '/:locale',
    name: 'StartPageLanguage',
    component: () => import('src/layouts/StartPage.vue'),
  },
  {
    path: '/manage',
    name: 'ManageGame',
    component: () => import('src/layouts/ManageGame.vue'),
    children: [
      {
        path: '',
        name: 'PrepareSession',
        component: () => import('src/pages/PrepareSession.vue'),
      },
      {
        path: 'game',
        name: 'RunSession',
        component: () => import('src/pages/RunSession.vue'),
      },
    ],
  },
  {
    path: '/lobby',
    name: 'LobbyRoom',
    component: () => import('src/pages/LobbyRoom.vue'),
  },
  {
    path: '/spectate',
    name: 'SpectateSession',
    component: () => import('src/pages/SpectateSession.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
