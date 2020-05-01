import store from ".."
import axios from 'axios'

export default {
    state: {
        connections : ["StackIt", "poka"],
        chosenProject: null,
        metadata: null,
        loadMetadata: false,
    },
    getters: {
        getDrawer(state) {
            return state.drawer
        },
        getConnection(state) {
            return state.connections
        },
        getMetadata(state) {
            return state.metadata
        },
        getLoadMetadata(state) {
            return state.loadMetadata
        }

    },
    mutations: {
        setloadMetadata(state, payload) {
            state.loadMetadata = payload
        },
        setMetadata(state, payload) {
            state.metadata = payload
        }
    },
    actions: {
        actMetadata({commit,state}) {
            store.commit("setloadMetadata", true)
            axios.post("http://127.0.0.1:4000/metadata", {"database":"broccoli"})
            .then((response) => {
                store.commit("setMetadata", response.data)
                store.commit("setloadMetadata", false)
            })
        }
        
    }
}