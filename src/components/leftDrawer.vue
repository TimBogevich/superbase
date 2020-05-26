<template>
    <div>
        <v-navigation-drawer
        app
        v-model="drawer"
        clipped
        >

            <div v-if="activeBtn==0">
                <v-select
                v-model="selectedConnection"
                @change="updateMetadata()"
                outlined
                append-icon="mdi-server"
                :items="connectionsList">
                    <template v-slot:selection="{ item }">
                        {{item }} - {{ catalog }}
                    </template>
                </v-select>
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
                :open="open"
                :items="metadata"
                item-text="objectName"
                activatable
                item-key="objectName"
                :load-children="openTree"
                :active.sync="active"
                return-object
                >
                    <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.objectType">
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                        {{ files[item.objectType] }}
                    </v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                    <div @click="setNewCatalog(item)">{{item.objectName}}</div>
                    </template>
                </v-treeview>
            </div>


            <div v-if="activeBtn==1">
                <v-treeview
                v-if="loadMetadata==false"
                :open="open"
                :items="fileManager"
                item-text="objectName"
                activatable
                item-key="objectName"
                :load-children="openTree"
                :active.sync="active"
                return-object
                >
                    <template v-slot:prepend="{ item, open }">
                    <v-icon v-if="!item.objectType">
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                        {{ files[item.objectType] }}
                    </v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                    <div @click="setNewCatalog(item)">{{item.objectName}}</div>
                    </template>
                </v-treeview>
                
            </div>

            <div v-if="activeBtn==2">
                <v-treeview
                v-if="loadMetadata==false"
                :open="open"
                :items="connections"
                item-text="name"
                activatable
                item-key="name"
                :load-children="openTree"
                :active.sync="active"
                return-object
                >
                    <template v-slot:prepend="{ item, open }">
                    <v-icon>
                        {{ open ? 'mdi-network' : 'mdi-network' }}
                    </v-icon>
                    </template>
                    <template v-slot:label="{ item }">
                    <div @click="setNewCatalog(item)">{{item.name}} - {{item.status}}</div>
                    </template>
                </v-treeview>
                
            </div>

            <template v-slot:append>
                <v-bottom-navigation
                    v-model="activeBtn"
                    grow
                    color="teal"
                >
                    <v-btn>
                        <span>Databases</span>
                        <v-icon>mdi-database</v-icon>
                    </v-btn>

                    <v-btn>
                        <span>Files</span>
                        <v-icon>mdi-file</v-icon>
                    </v-btn>
                    <v-btn>
                        <span>Connections</span>
                        <v-icon>mdi-network</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </template>

        </v-navigation-drawer>
    </div>
</template>


<script>

import { get, sync, call } from 'vuex-pathify'
import axios from 'axios'

export default {
    data() {
        return {
            catalog: "(choose catalog)",
            activeBtn : 0,
            open: [],
            active: [],
            files: {
                Database: 'mdi-database',
                "SYSTEM VIEW": 'mdi-view-grid-outline',
                VIEW: 'mdi-view-grid-outline',
                TABLE : 'mdi-table',
                file : 'mdi-file',
                folder : 'mdi-folder',
            },
        }
    },
    computed: {
        selectedConnectionObj : get("general/getSelectedConnectionObj"),
        selectedConnection : sync("general/selectedConnection"),
        fileManager : get("general/fileManager.files"),
        connections : sync('general/connections'),
        metadata: get("general/getMetadata"),
        loadMetadata: get('general/loadMetadata'),
        drawer : sync('general/drawer'),
        connectionsList() {
            return this.connections.map((item) => item.name)
        },


    },
    methods: {
        updateMetadata() {
            this.$store.dispatch("general/actMetadata")
        },
        async openTree(item) {
            let params = {
                "database": this.selectedConnectionObj.name,
                "catalog" : item.objectName
            }
            console.log(item)
            const metadata = await axios.post("http://localhost:4000/metadataObject", params )
            item.children = metadata.data
        },
        setNewCatalog(item) {
            if (item.objectType == "Database") {
                this.$store.dispatch("general/setDefaultCatalog", item.objectName)
                this.catalog = item.objectName
            }
        }
    },
}
</script>


<style>
.v-text-field__details {
  display: none;
}
</style>