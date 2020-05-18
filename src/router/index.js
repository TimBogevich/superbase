import Vue from 'vue'
import Router from 'vue-router'
import mainScreen from '@/components/mainScreen'
import fileManager from '@/components/fileManager'

Vue.use(Router)

export default new Router({
    mode: 'history',
  routes: [
    {
      path: '/',
      name: 'mainScreen',
      component: mainScreen
    },
    {
        path: '/fileManager',
        name: 'fileManager',
        component: fileManager
      }
  ]
})
