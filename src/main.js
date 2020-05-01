// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'


import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.css'


Vue.use(Vuetify)
Vue.use(VueAxios, axios)

Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.axios.defaults.headers.common['Content-Type'] = 'application/json';   

const vuetifyOptions = {theme: {
    dark: true,
  }
 }

/* eslint-disable no-new */
new Vue({
  el: '#App',
  router,
  store,
  icons: {
    iconfont: 'mdi',
  },
  vuetify: new Vuetify(vuetifyOptions),
  components: { App },
  template: '<App/>'
})
