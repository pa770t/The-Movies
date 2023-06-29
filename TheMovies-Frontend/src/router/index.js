import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/now-showing',
      name: 'now-showing',
      component: () => import('../views/NowShowingView.vue')
    },
    {
      path: '/latest-trailers',
      name: 'latest-trailers',
      component: () => import('../views/LatestTrailersView.vue')
    },
    {
      path: '/top-rated',
      name: 'top-rated',
      props: (route) => ({query: route.query}),
      component: () => import('../views/TopRatedView.vue')
    },
    {
      path: '/movie/:title',
      name: 'single-movie',
      component: () => import('../views/SingleMovieView.vue')
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/AdminDashboardView.vue')
    },
    {
      path: '/admin-dashboard/movielist',
      name: 'movielist-adminview',
      component: () => import('../views/MovieListAdminView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    },
    {
      path: '/movies',
      name: 'search',
      props: (route) => ({query: route.query}),
      component: () => import('../views/SearchMovieView.vue')
    },
  ]
})

export default router
