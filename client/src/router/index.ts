import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/LogActivityView',
      name: 'log-activity',
      component: () => import('../views/LogActivityView.vue'),
    },
    {
      path: '/AdminView',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/FriendView',
      name: 'friend',
      component: () => import('../views/FriendView.vue'),
    },
    {
      path: '/MoreStatsView',
      name: 'more-stats',
      component: () => import('../views/MoreStatsView.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
    }
  ],
})

export default router
