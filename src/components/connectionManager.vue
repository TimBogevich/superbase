<template>
  <div>
    <v-data-table
      :headers="connectionHeader"
      :items="connections"
      item-key="jobid"
      disable-sort
      hide-default-footer
      dense
    >
      <template
        v-slot:item.lastConnectDate="{ item }"
      >{{ convertDate(item.lastConnectDate, 'DD.MM.YYYY HH:mm') }}</template>
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="item.status == 'OK' ? 'green darken-4' : 'deep-orange darken-4'"
          dark
          small
        >{{item.status}}</v-chip>
      </template>
    </v-data-table>

    <v-dialog
      v-if="connectionForEdit"
      :value="connectionForEdit"
      @click:outside="connectionForEdit=null"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="pa-3">
        <v-card-title v-if="connectionForEdit.name" primary-title>Edit job</v-card-title>
        <v-card-title v-else primary-title>Create job</v-card-title>
        <v-card-text>
          <v-form ref="connectionEdit">
            <v-text-field 
            label="Name"
            :rules="rules.required"
            v-model="connectionForEdit.name">
            </v-text-field>
            <v-text-field 
            label="Connection string"
            :rules="rules.required"
            v-model="connectionForEdit.connectionString">
            </v-text-field>
            <v-text-field 
            label="User"
            :rules="rules.required"
            v-model="connectionForEdit.user">
            </v-text-field>
            <v-text-field 
            label="Password"
            :rules="rules.required"
            v-model="connectionForEdit.password">
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="connectionForEdit.connectionid" @click="connectionEditSave(connectionForEdit)">Save</v-btn>
          <v-btn v-else @click="connectionCreateSave(connectionForEdit)">Create</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="testConnection(connectionForEdit)">Test</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { get, sync } from "vuex-pathify";

export default {
  data() {
    return {
      progress: false,
      connectedSuccess: false,
      createConnection: false,
      newConnection: {},
      rules : {
        required : [v => !!v || 'Name is required']
      },
      connectionHeader: [
        { text: "connectionString", value: "connectionString" },
        { text: "lastConnectDate", value: "lastConnectDate" },
        { text: "status", value: "status" }
      ]
    };
  },
  computed: {
    connections: sync("connection/connections"),
    connectionForEdit: sync("connection/connectionForEdit"),
    createNewConnection: sync("general/createNewConnection"),
    mainProgressBar: sync("general/mainProgressBar"),
    selectedConnectionManager: sync("connection/selectedConnectionManager"),
    convertDate: get("general/convertDate"),
    item() {
      return this.selectedConnectionManager[0];
    }
  },
  methods: {
    testConnection(conn) {
      this.$store.dispatch("connection/testConnection", conn)
    }
  },
  created: function() {}
};
</script>