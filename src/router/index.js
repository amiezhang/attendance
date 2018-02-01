import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
