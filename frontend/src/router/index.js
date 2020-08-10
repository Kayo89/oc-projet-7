import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Logout from '../views/logout.vue'
import Profile from '../views/Profile.vue'
import Article from '../views/Article.vue'
import Add_Article from '../views/Add_Article.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home | Groupomania'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login | Groupomania'
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      title: 'Signup | Groupomania'
    }
  },
  {
    path: '/add-article',
    name: 'Add Article',
    component: Add_Article,
    meta: {
      title: 'Ajouter un Article | Groupomania'
    }
  },
  {
    path: '/logout',
    name: 'Log Out',
    component: Logout,
    meta: {
      title: 'Se déconnecter | Groupomania'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile | Groupomania'
    }
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    meta: {
      title: 'Article | Groupomania'
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
