import Vue from 'vue'
import axios from 'axios'
import { make, set, dispatch } from 'vuex-pathify'

const  state =  {
  connections : [],
  connectionIcon: "",
  selectedConnection: null,
  selectedConnectionManager : [],
  createNewConnection : false,
  connectionForEdit : null,
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
  async reconnectToDatabase({state,commit},connectionName) {
    const reconnect = await axios.get(getters.dataServer() + "/connections/reconnect/" + connectionName)
    const connections = axios.get(getters.dataServer() + "/connections")
    .then(result => commit('SET_CONNECTIONS', result.data))
    return connections
  },
  async createConnection({commit}, newConnection){
      const creaConnection = await axios.post(getters.dataServer() + "/connections/createConnection", newConnection)
      const connections = await axios.get(getters.dataServer() + "/connections")
      commit('SET_CONNECTIONS', connections.data)
      return connections
  },
  async disconnectDatabase({commit},connectionName) {
      const reconnect = await axios.get(getters.dataServer() + "/connections/disconnect/" + connectionName)
      const connections = axios.get(getters.dataServer() + "/connections")
      .then(result => commit('SET_CONNECTIONS', result.data))
      return connections
  },
  async testConnection({dispatch},conn) {
    try {
      await axios.post(getters.dataServer() + "/connections/testConnection", conn)
      this.dispatch("general/showSnackBar", "connected")
    } catch (error) {
      this.dispatch("general/showSnackBar", error.response.statusText)
    } 

  },

}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    }

