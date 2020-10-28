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
  // {
  //   path: '/letterDetail/:title',
  //   name: 'LetterDetail',
  //   component: () => import('../views/LetterDetail.vue'),
  //   props: true
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/login.vue')
  },
  {
    path: '/',
    name: 'MainWindowMobile',
    component: () => import('@/components/MobileComponents/MainWindowMobile.vue'),
    children:[
      {
        path: 'ReceivedLettersMobile',
        name: 'ReceivedLettersMobile',
        component: () => import('@/components/MobileComponents/ReceivedLettersMobile/ReceivedLettersMobile.vue'),
      },
      // {
      //   path: 'SentLetters',
      //   name: 'SentLetters',
      //   component: () => import('@/components/Cartable/SentLetters/SentLetters.vue')
      // },
      // {
      //   path: 'DraftLetters',
      //   name: 'DraftLetters',
      //   component: () => import('@/components/Cartable/DraftLetters/DraftLetters.vue')
      // },
      // {
      //   path: 'FolderLetters',
      //   name: 'FolderLetters',
      //   component: () => import('@/components/Cartable/ArchiveFolder/ArchiveFolder.vue'),
      //   props: (route: any) => ({folderId: route.query.folderId})
      // },
      // {
      //   path: 'AnnouncementBoard',
      //   name: 'AnnouncementBoard',
      //   component: () => import('@/components/Cartable/Announcements/Announcements.vue'),
      //   props: (route: any) => ({boardId: route.query.boardId})
      // },
      // {
      //   path: 'SearchResults',
      //   name: 'SearchResults',
      //   component: () => import('@/components/Cartable/SearchResultList/SearchResultList.vue'),
      // },
      // {
      //   path: 'IncomingClosedLetters',
      //   name: 'IncomingClosedLetters',
      //   component: () => import('@/components/Cartable/ClosedLetters/Incoming/IncomingClosedLetters.vue'),
      // },
      // {
      //   path: 'OutgoingClosedLetters',
      //   name: 'OutgoingClosedLetters',
      //   component: () => import('@/components/Cartable/ClosedLetters/Outgoing/OutgoingClosedLetters.vue'),
      // }
    ]
  },
  {
    path: '/',
    name: 'MainWindow',
    component: () => import('@/components/MainWindow.vue'),
    children:[
      {
        path: 'ReceivedLetters',
        name: 'ReceivedLetters',
        component: () => import('@/components/Cartable/ReceivedLetters/ReceivedLetters.vue'),
      },
      {
        path: 'SentLetters',
        name: 'SentLetters',
        component: () => import('@/components/Cartable/SentLetters/SentLetters.vue')
      },
      {
        path: 'DraftLetters',
        name: 'DraftLetters',
        component: () => import('@/components/Cartable/DraftLetters/DraftLetters.vue')
      },
      {
        path: 'FolderLetters',
        name: 'FolderLetters',
        component: () => import('@/components/Cartable/ArchiveFolder/ArchiveFolder.vue'),
        props: (route: any) => ({folderId: route.query.folderId})
      },
      {
        path: 'AnnouncementBoard',
        name: 'AnnouncementBoard',
        component: () => import('@/components/Cartable/Announcements/Announcements.vue'),
        props: (route: any) => ({boardId: route.query.boardId})
      },
      {
        path: 'SearchResults',
        name: 'SearchResults',
        component: () => import('@/components/Cartable/SearchResultList/SearchResultList.vue'),
      },
      {
        path: 'IncomingClosedLetters',
        name: 'IncomingClosedLetters',
        component: () => import('@/components/Cartable/ClosedLetters/Incoming/IncomingClosedLetters.vue'),
      },
      {
        path: 'OutgoingClosedLetters',
        name: 'OutgoingClosedLetters',
        component: () => import('@/components/Cartable/ClosedLetters/Outgoing/OutgoingClosedLetters.vue'),
      }
    ]
  }


]

const router = new VueRouter({
  routes
})

export default router
