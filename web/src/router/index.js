import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Index from '@/views/index'
import Welcome from '@/views/welcome'

const Attendance = resolve => require.ensure([], () => resolve(require('@/views/attendance')),'attendance')
const Lesson = resolve => require.ensure([], () => resolve(require('@/views/lesson')),'lesson')
const Student = resolve => require.ensure([], () => resolve(require('@/views/student')),'student')
const Question = resolve => require.ensure([], () => resolve(require('@/views/question')),'question')
const User = resolve => require.ensure([], () => resolve(require('@/views/user')),'user')

Vue.use(Router)

let router = new Router({
  routes: [
      {
          path: '/',
          component: Index,
          children: [
              {
                  path: 'attendance',
                  component: Attendance
              },
              {
                path: 'lesson',
                component: Lesson
              },
              {
                path: 'student',
                component: Student,
              },
              {
                path: 'question',
                component: Question
              },
              {
                path: 'user',
                component: User
              },
              {
                path: 'welcome',
                component: Welcome
              }
          ]
      },
      {
          path: '/login',
          component: Login
      }
  ]
})

// router.beforeEach((to, from, next) => {
//     let isLogin = router.app.$options.store.state.isLogin
//     if(!isLogin && to.path != '/login') {
        
//         next('/login')
//     } else if (isLogin && to.matched.length == 0){
//         next('/welcome')
//     } else {
//         next()
//     }
// })

export default router
