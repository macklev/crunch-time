import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import LogActivityView from '../views/LogActivityView.vue'
import AdminView from '../views/AdminView.vue'
import FriendView from '../views/FriendView.vue'
import MoreStatsView from '../views/MoreStatsView.vue'


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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
  ],
})

export default router
