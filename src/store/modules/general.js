import store from ".."
import axios from 'axios'
import { make, set } from 'vuex-pathify'


const  state =  {
        drawer: true,
        resultTable: [{" ":"Result will be here"}],
        dataServer : "http://localhost:4000",
        //dataServer : "https://superbase.datamachines.ru",
        selectedTab : 0,
        tabs: [{query:"--select * from employees.employees"}],
        query : "select * from employees.employees",
        connections : ["broccoli"],
        connectionIcon: "",
        selectedConnection: "broccoli",
        queryProgressBar:false,
        limitRows:10,
        output: "",
        metadata: null,
        loadMetadata: false,
        schema:{
            "tables": [
                {
                    "name":"customer",
                    "columns":[
                        "id",
                        "name",
                        "address",
                        "telephone"
                    ]
                },
                {
                    "name":"countries",
                    "columns":[
                        "id",
                        "name",
                        "iso_code"
                    ]
                }
            ]
        }
    }

const mutations =  {
    addTab(state) {
        state.tabs.push({query:""})
    },
    ...make.mutations(state),
    }

const actions = {
    actMetadata({commit}) {
        commit('SET_LOAD_METADATA', true)
        axios.post(state.dataServer +  "/metadata", {"database":"broccoli"})
        .then((response) => {
            commit('SET_METADATA', response.data)
            commit('SET_LOAD_METADATA', false)
        })
    },
    async connectToDataServer({commit,state}) {
        state.connectionIcon = "mdi-sync-circle"
        const connections = await axios.get(state.dataServer + "/connections")
        state.connectionIcon = "mdi-check-circle"
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

        let tabs = state.tabs.filter((item,key)=>{
            return key != tabIndex
        }) 
        console.log(tabs)
        commit('SET_TABS', tabs)
    
    },
    sendSQL({commit,state}) {
        commit("SET_QUERY_PROGRESS_BAR", true)
        var body =  {
            database: state.selectedConnection,
            query: state.tabs[state.selectedTab].query,
            limit: state.limitRows
        }
        const metadata = axios.post(state.dataServer + "/sql", body)
        .then((response) => {
            commit("SET_RESULT_TABLE", response.data.pop())
            commit("SET_QUERY_PROGRESS_BAR", "success")
        })
        .catch((error ) => { 
            commit("SET_QUERY_PROGRESS_BAR", "failed")
            var out = new Date().toLocaleString() + "       " + error + "\n"
            out = out.concat(state.output )
            commit("SET_OUTPUT", out )
        })

        return metadata
    }
        
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    }

