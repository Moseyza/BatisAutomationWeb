import Vue from 'vue'
import VueRouter from 'vue-router'
// import MainWindow from '../components/mainWindow.vue'
// import Home from '../views/Home.vue'


Vue.use(VueRouter)


const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/letterDetail/:title',
    name: 'LetterDetail',
    component: () => import(/* webpackChunkName: "LetterDetail" */'../views/LetterDetail.vue'),
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/login.vue')
  },
  {
    path: '/',
    name: 'Cartable',
    component: () => import('@/components/cartable.vue')
  }

]

const router = new VueRouter({
  routes
})

export default router
