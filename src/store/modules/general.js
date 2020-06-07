import Vue from 'vue'
import axios from 'axios'
import { make, set, dispatch } from 'vuex-pathify'


const  state =  {
        drawer: true,
        resultTable: null,
        selectedTab : 0,
        tabs: [{query:"select * from employees.employees"}],
        query : "select * from employees.employees",
        connections : [],
        connectionIcon: "",
        selectedConnection: null,
        selectedConnectionManager : [],
        createNewConnection : false,
        queryProgressBar:false,
        mainProgressBar:false,
        limitRows:50,
        output: "",
        showFileManager: false,
        fileManagerLoading: false,
        fileManager: {files:[]},
        fileManagerSaver: false, 
        saveFileDialog: false, 
        tabForSaveOrClose : null,
        metadata : [],
        leftDrawerBottom: 0,
        loadMetadata: false,
        schema:{}
    }

const mutations =  {
  closeTab(state, index) {
    state.tabs.splice(index, 1)
  },
  addTab(state, payload) {
    if (payload) {
      state.tabs.push(payload)
    }
    else {
      state.tabs.push({query:""})
    }
  },
  addMetadataChildren(state,{metadataItem, children}) {
      const metadataObj = state.metadata.find(item => item.connectionName == metadataItem.database ).metadata
      const catalog = metadataObj.find(item => item.objectName == metadataItem.catalog)
      catalog.children = children.data
  },
  setCatalog(state, catalog) {
      let selectedConnection = state.connections.filter(item => item.name == state.selectedConnection)[0]
      selectedConnection.catalog = catalog
  },
  setMetadata(state, payload) {
      state.metadata.push(payload)
  },
  changeTab(state, {tabIndex,payload}) {
    //state.tabs[tabIndex] = payload
    Vue.set(state.tabs, tabIndex, payload)
  },
  ...make.mutations(state),
}

const getters = {
    dataServer() {
      return process.env.DATA_SERVER
    },
    getMetadata(state) {
        let object =  state.metadata.filter(item => item.connectionName == state.selectedConnection)
        if (object[0]) {
            return object[0].metadata
        }
        else {
            return []
        }
    },
    tabsExt(state) {
      return state.tabs.map(item => {
          let tabInfo = item.filename || item.query.trim().substring(0,10) || "new file"
          return {query: item.query, tabInfo : tabInfo, edited: item.edited || false }

        })
    },
    getTables(state, getters) {
        var tables = {}

        function func(obj) {
            let name = obj.objectName
            if (obj.columns) {
                tables[name] = obj.columns.map(item => item.columnName)
            }
            if (!obj.children) {
                return
            }
            obj.children.forEach(child => func(child))
        }
        try {
            getters.getMetadata.forEach(item => func(item))
        } catch(error){}

        return tables
    },
    getSelectedConnectionObj(state) {
        return state.connections.find(item => item.name == state.selectedConnection)
    }
}

const actions = {
    async actMetadata({commit,state}) {
        commit('SET_LOAD_METADATA', true)
        let selectedConnection = state.selectedConnection
        const metadata = await axios.post(getters.dataServer() +  "/metadataCatalog", {"database":selectedConnection})
        commit('setMetadata', {connectionName : selectedConnection, metadata : metadata.data})
        commit('SET_LOAD_METADATA', false)


    },
    async reconnectToDatabase({state,commit},connectionName) {
        const reconnect = await axios.get(getters.dataServer() + "/connections/reconnect/" + connectionName)
        const connections = axios.get(getters.dataServer() + "/connections")
        .then(result => commit('SET_CONNECTIONS', result.data))
        return connections
    },
    async createConnection({commit}, newConnection){
        commit('SET_MAIN_PROGRESS_BAR', true)
        const creaConnection = await axios.post(getters.dataServer() + "/connections/createConnection", newConnection)
        const connections = await axios.get(getters.dataServer() + "/connections")
        commit('SET_CONNECTIONS', connections.data)
        commit('SET_MAIN_PROGRESS_BAR', false)
        return connections
    },
    async disconnectDatabase({state,commit},connectionName) {
        const reconnect = await axios.get(getters.dataServer() + "/connections/disconnect/" + connectionName)
        const connections = axios.get(getters.dataServer() + "/connections")
        .then(result => commit('SET_CONNECTIONS', result.data))
        return connections
    },
    async connectToDataServer({commit,state}) {
        commit('SET_CONNECTION_ICON', "mdi-sync-circle")
        const connections = await axios.get(getters.dataServer() + "/connections")
        commit('SET_CONNECTIONS', connections.data)
        commit('SET_SELECTED_CONNECTION', connections.data[0].name)
        commit('SET_CONNECTION_ICON', "mdi-check-circle")
        return connections
    },
    addNewTab({commit,state}) {
        commit("addTab")
        commit('SET_SELECTED_TAB', state.tabs.length -1 )
    },
    closeTab({commit,state}, tabIndex) {
        if (state.tabs.length == 1) {
            return 
        }

        if ( tabIndex != 0 ) {
            commit('SET_SELECTED_TAB', tabIndex - 1)
        }
        commit("closeTab", tabIndex)
    
    },
    getFiles({commit,state}) {
        axios.post(getters.dataServer() +  "/getFiles")
        .then((result) => state.fileManager.files = result.data )
    },
    async saveFile({commit,state}, {filename,tabIndex}) {
      let tab = state.tabs[tabIndex]
        let payload = {
            filename : filename,
            data : tab.query
        }
        const saveFile = await axios.post(getters.dataServer() +  "/saveFile", payload)
        commit("SET_FILE_MANAGER_LOADING", false)
        tab.filename = filename 
        tab.edited = false 
        commit("changeTab", {tabIndex, payload : tab})
    },
    sendSQL({commit,state}) {
        commit("SET_QUERY_PROGRESS_BAR", true)
        var body =  {
            database: state.selectedConnection,
            query: state.tabs[state.selectedTab].query,
            limit: state.limitRows
        }
        const metadata = axios.post(getters.dataServer() + "/sql", body)
        .then((response) => {
            commit("SET_RESULT_TABLE", response.data)
            commit("SET_QUERY_PROGRESS_BAR", "success")
        })
        .catch((error ) => { 
            commit("SET_QUERY_PROGRESS_BAR", "failed")
            var out = new Date().toLocaleString() + "       " + error + "\n"
            out = out.concat(state.output )
            commit("SET_OUTPUT", out )
        })

        return metadata
    },
    async loadMoreResults({commit,state}, resultTableTab) {
        var body =  {
            resultId : state.resultTable[resultTableTab].resultId,
            limit : state.limitRows,
        }
        const result = await axios.post(getters.dataServer() + "/sqlScroll", body)
        state.resultTable[resultTableTab].data = state.resultTable[resultTableTab].data.concat(result.data.data)
    },
    async setDefaultCatalog({commit,state}, catalog) {
        const result = await axios.post(getters.dataServer() + "/setDefaultCatalog", {database : state.selectedConnection, catalog})
    },
    async openFile({state,commit}, fileObj) {
        const file = await axios.post(getters.dataServer() + "/getOneFile", fileObj)
        commit("addTab",  file.data)
        commit("SET_SELECTED_TAB", state.tabs.length - 1 )
    },
    async deleteFile({state,commit}, fileObj) {
        const file = await axios.post(getters.dataServer() + "/deleteFile", fileObj)
        dispatch("general/getFiles")

    }


        
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    }

