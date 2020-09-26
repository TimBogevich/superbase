import Vue from 'vue'
import axios from 'axios'
import { make, set, dispatch, get } from 'vuex-pathify'
import moment from 'moment'

const  state =  {
        snackBar : false,
        snackBarMessage : null,
        drawer: true,
        globalLoader : false,
        resultTable: null,
        selectedTab : 0,
        tabs: [{query:"select * from employees.employees"}],
        queryProgressBar:false,
        mainProgressBar:false,
        limitRows:200,
        batchSize:50,
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
        leftDrawerCatalogActive : [],
        schema:{},
        queryHistory : [
          {id : 1, text : "select * from employess", date : "2020-02-20"},
          {id : 2, text : "select * from test", date : "2020-02-20"},
        ],
        treeViewIcons : {
          Database: 'mdi-database',
          "SYSTEM VIEW": 'mdi-view-grid-outline',
          VIEW: 'mdi-view-grid-outline',
          TABLE : 'mdi-table',
          PROCEDURE : 'mdi-script-text-outline',
          "SYSTEM TABLE" : 'mdi-table',
          file : 'mdi-file-document',
          directory : 'mdi-folder-outline',
          job : 'mdi-run',
      },
      codeEditorDevider : ";\n"
    }

const mutations =  {
  closeTab(state, index) {
    state.tabs.splice(index, 1)
  },
  setCurrentQuery(state, data) {
    if (data != state.tabs[state.selectedTab].query ) {
      state.tabs[state.selectedTab].query = data
      state.tabs[state.selectedTab].edited = true
    }
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
  setCatalog({state, rootState}, catalog) {
      let selectedConnection = state.connections.filter(item => item.name == rootState.connection.selectedConnection)[0]
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
  convertDate() {
    return (value, format) => {
      if(value) {
        return moment(value).format(format)
      }
      else {
        return "-"
      }
    }
  },
  convertInterval() {
    return (begin, end) => {
      if(begin && end) {
        let diff = moment(end).diff(moment(begin));
        return moment.utc(diff).format("HH:mm:ss");
      }
      else {
        return "..."
      }
    }
  },
    dataServer() {
      return process.env.DATA_SERVER
    },
    getCurrentQuery(state) {
      return state.tabs[state.selectedTab].query
    },
    getMetadata(state, getters, rootState) {
      let object =  state.metadata.find(item => 
        item.connectionName == rootState.connection.selectedConnection
      )
      if (object) {
          return object.metadata
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
}

const actions = {
  showSnackBar({commit},message) {
    commit('SET_SNACK_BAR', true)
    commit('SET_SNACK_BAR_MESSAGE', message)
  },
    async actMetadata({commit,state,rootState }) {
        commit('SET_LOAD_METADATA', true)
        let selectedConnection = rootState.connection.selectedConnection
        const metadata = await axios.post(getters.dataServer() +  "/metadataCatalog", {"database":selectedConnection})
        commit('setMetadata', {connectionName : selectedConnection, metadata : metadata.data})
        commit('SET_LOAD_METADATA', false)
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
    sendSQL({commit,state, rootState}) {
        commit("SET_QUERY_PROGRESS_BAR", true)
        var body =  {
            database: rootState.connection.selectedConnection,
            query: state.tabs[state.selectedTab].query,
            limit: state.limitRows,
            batchSize: state.batchSize,
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
            batchSize : state.batchSize,
        }
        const result = await axios.post(getters.dataServer() + "/sqlScroll", body)
        state.resultTable[resultTableTab].data = state.resultTable[resultTableTab].data.concat(result.data.data)
        state.resultTable[resultTableTab].endCursor = result.data.endCursor
    },
    async setDefaultCatalog({commit,state, rootState}, catalog) {
        const result = await axios.post(getters.dataServer() + "/setDefaultCatalog", {database : rootState.connection.selectedConnection, catalog})
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

