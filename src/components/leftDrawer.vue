<template>
  <div>
    <v-navigation-drawer app width="400" v-model="drawer" clipped>
      <v-flex fill-height flex-direction: row class="ma-0">
        <v-flex xs2 justify="center" id="mini-drawer">
          <v-list>
            <v-list-item-group v-model="leftDrawerBottom" mandatory color="primary">
              <v-list-item key="1">
                <v-list-item-icon>
                  <v-icon>mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item key="2">
                <v-list-item-icon>
                  <v-icon>mdi-file</v-icon>
                </v-list-item-icon>
                <v-list-item-title></v-list-item-title>
              </v-list-item>
              <v-list-item key="3">
                <v-list-item-icon>
                  <v-icon>mdi-network</v-icon>
                </v-list-item-icon>
                <v-list-item-title></v-list-item-title>
              </v-list-item>
              <v-list-item key="4">
                <v-list-item-icon>
                  <v-icon>mdi-timetable</v-icon>
                </v-list-item-icon>
                <v-list-item-title></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-flex>
        <v-flex xs10 id="big-drawer">
          <div v-if="leftDrawerBottom==0">
            <v-select
              v-model="selectedConnection"
              @change="actMetadata()"
              outlined
              dense
              item-text="name"
              item-value="name"
              append-icon="mdi-server"
              :items="connections"
              single-line
            >
              <template v-slot:selection="{ item }">{{item.name }} - {{ catalog }}</template>
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
              hoverable
              dense
              :items="metadata"
              item-text="objectName"
              item-key="uid"
              :load-children="expandMetadataTree"
              :active.sync="leftDrawerCatalogActive"
              activatable
              return-object
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.objectType">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                <v-icon v-else>{{ treeViewIcons[item.objectType] }}</v-icon>
              </template>
              <template v-slot:leaf="{ item }">
                <span>{{item.objectName}}</span>
              </template>
              <template v-slot:append="{ item }">
                <v-menu left>
                  <template v-slot:activator="{ on }">
                    <v-btn dark icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list v-if="item.menuType == 'selectable'">
                    <v-list-item @click="generateSelect(item)" key="0">
                      <v-list-item-title>SELECT *</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="generateUpdate(item)" key="1">
                      <v-list-item-title>UPDATE</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="generateDelete(item)" key="2">
                      <v-list-item-title>DELETE</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                  </v-list>
                  <v-list v-else-if="item.menuType == 'Catalog'">
                    <v-list-item @click="setNewCatalog(item)" key="0">
                      <v-list-item-title>Set catalog</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-treeview>
          </div>

          <div v-if="leftDrawerBottom==1">
            <v-treeview
              v-if="loadMetadata==false"
              :open="open"
              dense
              :items="fileManager.children"
              item-text="name"
              item-key="objectName"
              return-object
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.type">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
                <v-icon v-else>{{ treeViewIcons[item.type] }}</v-icon>
              </template>
              <template v-slot:append="{ item }">
                <v-menu left>
                  <template v-slot:activator="{ on }">
                    <v-btn dark icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item key="0" @click="openFile(item)" v-if="item.type=='file'">
                      <v-list-item-title>Open in editor</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="1" @click="deleteFile(item)" v-if="item.type=='file'">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-treeview>
          </div>

          <div v-if="leftDrawerBottom==2">
          <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Connection name
                    </th>
                  </tr>
                </thead>
              </template>
            </v-simple-table>
            <v-treeview
              :items="connections"
              activatable
              dense
              item-key="name"
              :active.sync="selectedConnectionManager"
              return-object
            >
              <template v-slot:prepend="{}">
                <v-icon>mdi-network</v-icon>
              </template>
              <template v-slot:append="{ item }">
                <v-menu left>
                  <template v-slot:activator="{ on }">
                    <v-btn small dark icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item key="0" @click="connectionForEdit = Object.assign({}, item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="1" @click="disconnectDatabase(item.name)">
                      <v-list-item-title>Disconnect</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="2" @click="reconnectToDatabase(item.name)">
                      <v-list-item-title>Connect (reconnect)</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-treeview>
          </div>

          
          <div v-if="leftDrawerBottom==3">
          <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Job name
                    </th>
                  </tr>
                </thead>
              </template>
            </v-simple-table>
            <v-treeview
              :open="open"
              activatable
              :items="jobs"
              :active.sync="selectedJob"
              item-text="name"
              item-key="jobid"
              return-object
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon small> mdi-run</v-icon>
              </template>
              <template v-slot:append="{ item }">
                <v-progress-circular 
                class="mr-1"
                v-if="jobLoaderById.indexOf(item.jobid) >= 0"
                indeterminate
                :size="25"
                color="primary"
                ></v-progress-circular>
                <v-menu left>
                  <template v-slot:activator="{ on }">
                    <v-btn small dark icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item key="0" @click="jobForEdit = Object.assign({}, item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="1" @click="jobRun(item.jobid)">
                      <v-list-item-title>Run manual</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-treeview>
          </div>
        </v-flex>
      </v-flex>




      <template v-slot:append>
        <v-flex flex-direction: row xs12 class="ma-0">
          <v-flex xs2  class="pl-5 pt-3">
              <v-icon disabled>mdi-cog</v-icon>
          </v-flex>

          <v-flex>
            <v-bottom-navigation grow color="teal">
              <v-btn @click="refresh()">
                <span>Refresh</span>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn @click="addNewJob()" v-if="leftDrawerBottom==3">
                <span>Add</span>
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn disabled>
                <span>Save</span>
                <v-icon>mdi-floppy</v-icon>
              </v-btn>
            </v-bottom-navigation>
          </v-flex>
        </v-flex>
      </template>
    </v-navigation-drawer>
  </div>
</template>


<script>
import { get, sync, call } from "vuex-pathify";
import { mapActions } from 'vuex'
import axios from "axios";

export default {
  data() {
    return {
      catalog: "(choose catalog)",
      open: [],
    };
  },
  computed: {
    jobs : sync('jobRunner/jobs'),
    selectedJob : sync('jobRunner/selectedJob'),
    jobLoaderById : sync('jobRunner/jobLoaderById'),
    jobForEdit : sync('jobRunner/jobForEdit'),
    dataServer : get('general/dataServer'),
    codeEditorDevider: sync("general/codeEditorDevider"),
    leftDrawerCatalogActive: sync("general/leftDrawerCatalogActive"),
    treeViewIcons: get("general/treeViewIcons"),
    selectedConnectionObj: get("connection/getSelectedConnectionObj"),
    selectedConnection: sync("connection/selectedConnection"),
    fileManager: get("general/fileManager.files"),
    connections: sync("connection/connections"),
    connectionForEdit: sync("connection/connectionForEdit"),
    metadata: get("general/getMetadata"),
    createNewConnection: sync("general/createNewConnection"),
    loadMetadata: get("general/loadMetadata"),
    drawer: sync("general/drawer"),
    selectedConnectionManager: sync("connection/selectedConnectionManager"),
    leftDrawerBottom: sync("general/leftDrawerBottom"),
    saveFileDialog: sync("general/saveFileDialog"),
    query: {
      get: get("general/getCurrentQuery"),
      set(value) {
        this.$store.commit("general/setCurrentQuery", value);
      }
    }
  },
  methods: {
    ...mapActions('general', [ 
      'openFile',  
      'deleteFile',  
      'actMetadata',  
    ]),
    ...mapActions('connection', [ 
      'disconnectDatabase', 
      'reconnectToDatabase',
    ]),
    async jobRun(jobid) {
      const result = await axios.post(`${this.dataServer}/jobs/run/${jobid}`,{operation : "run"});
    },
    refresh() {
      if (this.leftDrawerBottom==3) {
        const jobs = this.$store.dispatch("jobRunner/getJobs")
      }
    },
    async expandMetadataTree(item) {
      let metadataItem = {
        database: this.selectedConnectionObj.name,
        catalog: item.objectName
      };
      const children = await axios.post(
        `${this.dataServer}/metadataObject`,
        metadataItem
      );
      this.$store.commit("general/addMetadataChildren", {
        metadataItem,
        children
      });
    },
    setNewCatalog(item) {
      if (item.objectType == "Database") {
        this.$store.dispatch("general/setDefaultCatalog", item.objectName);
        this.catalog = item.objectName;
      }
    },
    generateSelect(item) {
      this.query = `${this.query} \nSELECT * FROM ${item.catalog}.${item.objectName}${this.codeEditorDevider}`;
    },
    generateUpdate(item) {
      let columns = item.columns.map(col => col.columnName)
      columns = columns.join(" = 'value',\n") + " = 'value'"
      this.query = `${this.query} \nUPDATE ${item.catalog}.${item.objectName} \nSET ${columns}${this.codeEditorDevider}`;
    },
    generateDelete(item) {
      this.query = `${this.query} \nDELETE FROM ${item.catalog}.${item.objectName}${this.codeEditorDevider}`;
    },
    addNewJob() {
      this.jobForEdit = {}
    }
    
  }
};
</script>


<style>
.v-text-field__details {
  display: none;
}

.v-treeview-node {
  cursor: pointer;
}

#mini-drawer {
  background-color: #252121;
  position: fixed;
  height: 100%;
}
#big-drawer {
  margin-left: 67px;
}


.v-navigation-drawer__content::-webkit-scrollbar {
  width: 5px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  background: rgba(238, 238, 238, 0.753);
  border-radius: 20px;
}

.transparentTable {
   background-color: transparent !important;
}

.v-treeview-node__root {
    min-height: 32px !important;
}
</style>

