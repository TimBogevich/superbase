import Vue from 'vue'
import Vuex from 'vuex'
import general from './modules/general'
import pathify from 'vuex-pathify'

pathify.options.mapping = 'standard'
pathify.options.deep = 2

Vue.use(Vuex)

export default new Vuex.Store ({
    plugins: [ pathify.plugin ],
    modules: {
        general, 
    },

})