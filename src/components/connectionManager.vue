<template>
    <div>
        <v-data-table
          :headers="jobHeader"
          :items="connections"
          item-key="jobid"
          disable-sort
          hide-default-footer
          dense
        >
          <template v-slot:item.lastConnectDate="{ item }">
            {{ convertDate(item.lastConnectDate, 'DD.MM.YYYY HH:mm') }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status == 'OK' ? 'green darken-4' : 'deep-orange darken-4'" dark small>{{item.status}}</v-chip>
          </template>
        </v-data-table>
    </div>
</template>


<script>
import { get,sync } from 'vuex-pathify'

export default {
    data() {
        return {
            progress: false,
            connectedSuccess : false, 
            createConnection:false,
            newConnection: {},
            jobHeader: [
              { text: "connectionString", value: "connectionString" },
              { text: "lastConnectDate", value: "lastConnectDate" },
              { text: "status", value: "status" },
            ],
        }
    },
    computed: {
        connections : sync("general/connections"),
        createNewConnection : sync("general/createNewConnection"),
        mainProgressBar : sync("general/mainProgressBar"),
        selectedConnectionManager : sync('general/selectedConnectionManager'),
        convertDate: get("general/convertDate"),
        item () {
            return this.selectedConnectionManager[0] 
        }
    },
    methods: {

    },
    created: function() {
    }
}
</script>