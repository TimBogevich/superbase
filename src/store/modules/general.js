import store from ".."
import axios from 'axios'
import { make, set } from 'vuex-pathify'


const  state =  {
        query : "select * from employees.employees",
        connections : ["StackIt"],
        chosenProject: null,
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
    ...make.mutations(state),
    }

const actions = {
    actMetadata({commit}) {
        commit('SET_LOAD_METADATA', true)
        axios.post("http://127.0.0.1:4000/metadata", {"database":"broccoli"})
        .then((response) => {
            commit('SET_METADATA', response.data)
            commit('SET_LOAD_METADATA', false)
        })
    }
        
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    }

