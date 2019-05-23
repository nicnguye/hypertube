import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/register'
import Try from '@/components/try'
import Confirmation from '@/components/confirmation'
import Login from '@/components/login'
import Profil from '@/components/profil'
import ChangePassword from '@/components/changePassword'
import ChangeUserInfos from '@/components/changeUserInfos'
import Connect from '@/components/connect'
import RegisterEmail from '@/components/registerEmail'
import Users from '@/components/users'
import Movies from '@/components/movies'
import Watch from '@/components/watch'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/try',
      name: 'try',
      component: Try
    },
    {
      path: '/confirmation/:token',
      name: 'confirmation',
      component: Confirmation
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePassword
    },
    {
      path: '/connect',
      name: 'connect',
      component: Connect
    },
    {
      path: '/changeUserInfos',
      name: 'changeUserInfos',
      component: ChangeUserInfos
    },
    {
      path: '/registerEmail',
      name: 'registerEmail',
      component: RegisterEmail
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/movies',
      name: 'movies',
      component: Movies
    },
    {
      path: '/watch/:moviePath',
      name: 'watch',
      component: Watch
    },
  ]
})
