<template>
    <div>
        <v-app-bar
        app
        clipped-left>
            <v-toolbar-title>Connection manager </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link to="/">
                <v-btn color="red">Back</v-btn>
            </router-link>
        </v-app-bar>
        <v-content>
            <v-progress-linear
                color="light-blue"
                :indeterminate="progress"
                height="10"
                value="0"
                striped
            ></v-progress-linear>
            <v-container grid-list-md>
                  <v-card>
                    <v-toolbar flat color="gray" dark>
                    <v-toolbar-title>Connections</v-toolbar-title>
                    </v-toolbar>
                    <v-tabs
                    vertical>
                    <v-tab
                    v-model="selectedTab"
                    right
                    v-for="(item, index) in connections" :key="index">
                        <v-icon left>mdi-file</v-icon>
                        {{item.name}}
                    </v-tab>

                    <v-tab-item
                    v-for="(item, index) in connections" :key="index">
                        <v-text-field
                            label="Connection string"
                            :value="item.connectionString"
                        >
                        </v-text-field>
                        <v-text-field
                            label="Status"
                            :value="item.status"
                        >
                        </v-text-field>
                        <v-text-field
                            label="DBMS"
                            :value="item.status"
                        >
                        </v-text-field>
                        <v-text-field
                            label="Last connection date"
                            :value="item.lastConnectDate"
                        >
                        </v-text-field>
                        <v-btn color="red" @click="disconnect()">Disconnect</v-btn>
                        <v-btn color="success" @click="reconnect()">Reconnect</v-btn>
                    </v-tab-item>
                    </v-tabs>
                </v-card>
            </v-container>
        </v-content>
    </div>
</template>


<script>
import { get,sync } from 'vuex-pathify'

export default {
    data() {
        return {
            selectedTab: 0,
            progress: false
        }
    },
    computed: {
        connections : get("general/connections"),
    },
    methods: {
        reconnect() {
            this.progress = true
            let connectionName = this.connections[this.selectedTab].name
            this.$store.dispatch("general/reconnectToDatabase", connectionName)
            this.progress = false
        },
        disconnect() {
            this.progress = true
            let connectionName = this.connections[this.selectedTab].name
            this.$store.dispatch("general/disconnectDatabase", connectionName)
            this.progress = false
        },
    },
    created: function() {
    }
}
</script>