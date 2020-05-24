<template>
    <div>
        <v-navigation-drawer
        app
        v-model="drawer"
        clipped
        >
            <v-select
            v-model="selectedConnection"
            @change="updateMetadata()"
            outlined
            append-icon="mdi-server"
            :items="connectionsList">
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
            open-on-click
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
            </v-treeview>
        </v-navigation-drawer>
    </div>
</template>


<script>

import { get, sync, call } from 'vuex-pathify'
import axios from 'axios'

export default {
    data() {
        return {
            open: [],
            active: [],
            files: {
                Database: 'mdi-database',
                "SYSTEM VIEW": 'mdi-view-grid-outline',
                VIEW: 'mdi-view-grid-outline',
                TABLE : 'mdi-table',
            },
        }
    },
    computed: {
        selectedConnection : sync("general/selectedConnection"),
        connections : get('general/connections'),
        metadata: get("general/getMetadata"),
        loadMetadata: get('general/loadMetadata'),
        drawer : sync('general/drawer'),
        connectionsList() {
            return this.connections.map((item) => item.name)
        } 

    },
    methods: {
        updateMetadata() {
            this.$store.dispatch("general/actMetadata")
        },
        async openTree(item) {
            let params = {
                "database": this.selectedConnection,
                "catalog" : item.objectName
            }
            console.log(item)
            const metadata = await axios.post("http://localhost:4000/metadataObject", params )
            item.children = metadata.data
        }
    },
}
</script>


<style>
.v-text-field__details {
  display: none;
}
</style>