import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'

import Article from '../views/Article.vue'
import Add_Article from '../views/Add_Article.vue'
import Edit from '../views/ModifyContent.vue'

import Profile from '../views/Profile.vue'
import Edit_Profile from '../views/Edit_Profile.vue'

import User from '../views/User.vue'

import Admin from '../views/Admin.vue'

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
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    meta: {
      title: 'User Profile | Groupomania'
    }
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit,
    meta: {
      title: 'Modifier | Groupomania'
    }
  },
  {
    path: '/edit-profile',
    name: 'Modifier Profile',
    component: Edit_Profile,
    meta: {
      title: 'Modifier Profile | Groupomania'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: 'Admin | Groupomania'
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
