import Vue from 'vue'
import Vuex from 'vuex'
import general from './modules/general'
import jobRunner from './modules/jobRunner'
import connection from './modules/connection'
import pathify from 'vuex-pathify'
import createPersistedState from "vuex-persistedstate";

pathify.options.mapping = 'standard'
pathify.options.deep = 2

Vue.use(Vuex)

export default new Vuex.Store ({
    plugins: [ 
      pathify.plugin,
      createPersistedState({
        paths : [
          "general.tabs",
          "general.selectedTab",
        ]
      })
    ],
    modules: {
        general,
        jobRunner,
        connection,
    },

})