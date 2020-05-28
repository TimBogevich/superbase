<template>
    <div v-if="selectedConnectionManager.length >0 || createNewConnection">
        <div v-if="!createNewConnection">
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
        </div>

        <div v-if="createNewConnection">
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
                <v-btn color="red" @click="createNewConnection=false">cancel</v-btn>
                <v-btn color="success" @click="testConnection()">Test</v-btn>
                <v-btn color="success" @click="saveConnection()">Save</v-btn>
            </v-form>
        </div>

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
        createNewConnection : sync("general/createNewConnection"),
        mainProgressBar : sync("general/mainProgressBar"),
        selectedConnectionManager : sync('general/selectedConnectionManager'),
        item () {
            return this.selectedConnectionManager[0] 
        }
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