<template>
    <div>
        <v-navigation-drawer
        app
        v-model="drawer"
        clipped
        >
            <v-select
            v-model="selectedConnection"
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
    </div>
</template>


<script>

import { get, sync, call } from 'vuex-pathify'

export default {
    data() {
        return {
            open: [],
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
        selectedConnection : sync("general/selectedConnection"),
        connections : get('general/connections'),
        metadata : get('general/metadata'),
        loadMetadata: get('general/loadMetadata'),
        drawer : sync('general/drawer'),
        connectionsList() {
            return this.connections.map((item) => item.name)
        } 

    },
}
</script>


<style>
.v-text-field__details {
  display: none;
}
</style>