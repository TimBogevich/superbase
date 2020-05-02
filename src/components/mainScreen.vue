<template>
    <div>
        <v-navigation-drawer
        app
        clipped
        >
            <v-progress-linear
            v-if="loadMetadata==true"
            color="light-blue"
            indeterminate
            height="10"
            value="10"
            striped
            ></v-progress-linear>
            <v-treeview
            v-if="loadMetadata==false"
            v-model="tree"
            :open="open"
            :items="metadata"
            item-text="objectName"
            activatable
            item-key="objectName"
            open-on-click
            >
                <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.objectType">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                    {{ files[item.objectType] }}
                </v-icon>
                </template>
            </v-treeview>
        </v-navigation-drawer>

        <v-app-bar
        app
        clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>SQL editor </v-toolbar-title>
            <v-col cols="2">
                <v-overflow-btn
                class="ml-5"
                :items="connections"
                label="connection"
                value="1"
                ></v-overflow-btn>
            </v-col>
            <v-btn class="ml-5"  color="success" v-on:click="sendSQL">Run</v-btn>
        </v-app-bar>

        <v-content>
            <v-container
            fluid
            fill-height
            >
            <v-row>
                <v-col
                cols="12">
                    <codeEditor />
                </v-col>
            </v-row>
            <v-row>
                <v-progress-linear v-if="this.progressBar == false" color="yellow darken-2"></v-progress-linear>
                <v-progress-linear v-if="this.progressBar == true" color="yellow darken-2" indeterminate></v-progress-linear>
                <v-progress-linear v-if="this.progressBar == 'success'" color="green darken-2"></v-progress-linear>
                <v-progress-linear v-if="this.progressBar == 'failed'" color="red darken-2"></v-progress-linear>
                <v-tabs>
                    <v-tab key="1">Result</v-tab>
                    <v-tab key="2">Compiled SQL</v-tab>
                    <v-tab-item key="1">
                        <v-data-table
                            :headers="headers"
                            :items="resultTable"
                            :items-per-page="5"
                        ></v-data-table>
                    </v-tab-item>
                    <v-tab-item key="2">
                        <v-textarea
                        disabled
                        no-resize
                        auto-grow
                        v-model="result"
                        ></v-textarea>
                    </v-tab-item>
                
                </v-tabs>
            </v-row>
            </v-container>
        </v-content>

    </div>
</template>

<script>

import nunjucks from "nunjucks"
import codeEditor from "./codeEditor"
import { get, sync, call } from 'vuex-pathify'

var request = `select * from employees.employees`




export default {
    components: {codeEditor},
    data() {
        return {
            progressBar: false,
            resultTable: [{" ":"Result will be here"}],
            open: ['public'],
            files: {
                Database: 'mdi-database',
                "SYSTEM VIEW": 'mdi-view-grid-outline',
                VIEW: 'mdi-view-grid-outline',
                TABLE : 'mdi-table',
            },
            tree: [],
        }
    },
    computed: {
        result : function() {
            return nunjucks.renderString(this.query,this.schema)
        },
        headers: function() {
            return Object.keys(this.resultTable[0]).map((item)=> {
                    return { text: item, value: item }
                })
        },
        connections: get('general/connections'),
        metadata:get('general/metadata'),
        query:get('general/query'),
        schema:get('general/schema'),
        loadMetadata: get('general/loadMetadata'),
    },
    methods: {
        sendSQL: function(query) {
            this.progressBar = true
            var body =  {
            database:"broccoli",
            query: this.result,
            limit: 10
            }

            this.axios.post("http://127.0.0.1:4000/sql", body)
            .then((response) => {
                console.log(response.data)
                this.resultTable = response.data
                this.progressBar = "success"
            })
            .catch(() => { 
                this.progressBar = "failed" 
            });
        }
    }, 
    created: function() {
        this.$store.dispatch("general/actMetadata")
    }

}
</script>

<style>
#vue-codemirror {
  width: auto;
}
</style>