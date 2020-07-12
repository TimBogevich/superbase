import Vue from 'vue'
import axios from 'axios'
import { make, set, dispatch } from 'vuex-pathify'

const  state =  {
  connections : [],
  connectionIcon: "",
  selectedConnection: null,
  selectedConnectionManager : [],
  createNewConnection : false,
}

const mutations =  {
  ...make.mutations(state),
}

const getters = {
  dataServer() {
    return process.env.DATA_SERVER
  },
  getSelectedConnectionObj(state) {
    return state.connections.find(item => item.name == state.selectedConnection)
},
}

const actions = {
  async connectToDataServer({commit,state}) {
    commit('SET_CONNECTION_ICON', "mdi-sync-circle")
    const connections = await axios.get(getters.dataServer() + "/connections")
    commit('SET_CONNECTIONS', connections.data)
    commit('SET_SELECTED_CONNECTION', connections.data[0].name)
    commit('SET_CONNECTION_ICON', "mdi-check-circle")
    return connections
},

}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    }

