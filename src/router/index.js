import Vue from 'vue'
import Router from 'vue-router'
import mainScreen from '@/components/mainScreen'
import connectionManager from '@/components/connectionManager'

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
        path: '/connectionManager',
        name: 'connectionManager',
        component: connectionManager
    }
  ]
})
