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
                v-if="mainProgressBar"
                color="light-blue"
                indeterminate
                absolute
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
                    <v-tab 
                    right
                    v-if="createConnection==true"
                    v-model="selectedTab"> NEW connection
                    </v-tab>
                    <v-btn 
                        v-if="createConnection != true"
                        @click="createConnection = true"
                        class="align-self-center">
                            NEW
                            <v-icon right>mdi-plus</v-icon>
                    </v-btn>

                    <v-tab-item
                    v-for="(item, index) in connections" :key="index">
                        <v-text-field
                            :disabled="!editable"
                            label="Connection string"
                            :value="item.connectionString"
                        >
                        </v-text-field>
                        <v-text-field
                            :disabled="!editable"
                            label="Status"
                            :value="item.status"
                        >
                        </v-text-field>
                        <v-text-field
                            :disabled="!editable"
                            label="DBMS"
                            :value="item.status"
                        >
                        </v-text-field>
                        <v-text-field
                            :disabled="!editable"
                            label="Last connection date"
                            :value="item.lastConnectDate"
                        >
                        </v-text-field>
                        <v-btn color="red" @click="disconnect()">Disconnect</v-btn>
                        <v-btn color="success" @click="reconnect()">Reconnect</v-btn>
                    </v-tab-item>

                    <v-tab-item 
                     v-if="createConnection==true"
                     key="9999">
                      <v-form ref="formNewConnection">
                        <v-text-field
                            required
                            label="Connection name"
                            placeholder="new connection"
                            v-model="newConnection.name"
                        >
                        </v-text-field>
                        <v-text-field
                            required
                            label="Connection string"
                            v-model="newConnection.connectionString"
                        >
                        </v-text-field>
                        <v-text-field
                            label="User"
                            v-model="newConnection.user"
                        >
                        </v-text-field>
                        <v-text-field
                            label="Password"
                            v-model="newConnection.password"
                        >
                        </v-text-field>
                        <v-btn color="red" @click="createConnection=false">cancel</v-btn>
                        <v-btn color="success" @click="testConnection()">Test</v-btn>
                        <v-btn color="success" @click="saveConnection()">Save</v-btn>
                      </v-form>
                    </v-tab-item>

                    </v-tabs>
                </v-card>

                <v-snackbar
                v-model="connectedSuccess"
                >
                Connected!
                <v-btn
                    text
                    @click="connectedSuccess = false"
                >
                    Close
                </v-btn>
                </v-snackbar>
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
            progress: false,
            editable: false,
            connectedSuccess : false, 
            createConnection:false,
            newConnection: {},
        }
    },
    computed: {
        connections : sync("general/connections"),
        mainProgressBar : sync("general/mainProgressBar"),
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
        testConnection() {
            this.axios.post("http://127.0.0.1:4000/connections/testConnection", this.newConnection)
            .then(this.connectedSuccess = true)
        },
        saveConnection() {
            this.progress = true
            this.$store.dispatch("general/createConnection", this.newConnection)
            .then(this.progress = false)
        }
    },
    created: function() {
    }
}
</script>