import Vue from 'vue'
import Router from 'vue-router'
import mainScreen from '@/components/mainScreen'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainScreen',
      component: mainScreen
    },
    {
        path: '/test',
        name: 'test',
        component: test
      }
  ]
})
