<template>
  <div>
    <v-navigation-drawer app width="400" v-model="drawer" clipped>
      <v-flex fill-height flex-direction: row class="ma-0">
        <v-flex xs2 justify="center" id="mini-drawer">
          <v-list>
            <v-list-item-group v-model="leftDrawerBottom" color="primary">
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
            </v-list-item-group>
          </v-list>
        </v-flex>
        <v-flex xs10 id="big-drawer">
          <div v-if="leftDrawerBottom==0">
            <v-select
              v-model="selectedConnection"
              @change="updateMetadata()"
              outlined
              append-icon="mdi-server"
              :items="connectionsList"
            >
              <template v-slot:selection="{ item }">{{item }} - {{ catalog }}</template>
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
                    <v-list-item key="1" disabled>
                      <v-list-item-title>UPDATE</v-list-item-title>
                    </v-list-item>
                    <v-list-item key="1" disabled>
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
            <div id="saver"></div>
            <v-treeview
              v-if="loadMetadata==false"
              :open="open"
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
            <v-treeview
              :items="connections"
              activatable
              item-key="name"
              :active.sync="selectedConnectionManager"
              return-object
            >
              <template v-slot:prepend="{}">
                <v-icon>mdi-network</v-icon>
              </template>
              <template v-slot:label="{ item }">
                <div @click="setNewCatalog(item)">{{item.name}} - {{item.status}}</div>
              </template>
            </v-treeview>
            <v-btn @click="createNewConnection=true" block>+</v-btn>
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
              <v-btn disabled>
                <span>Refresh</span>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn disabled>
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
import axios from "axios";

export default {
  data() {
    return {
      catalog: "(choose catalog)",
      dialog: true,
      absolute: false,
      fileNameToSave: "",
      open: [],
      activeConnection: null
    };
  },
  computed: {
    leftDrawerCatalogActive: sync("general/leftDrawerCatalogActive"),
    treeViewIcons: get("general/treeViewIcons"),
    selectedConnectionObj: get("general/getSelectedConnectionObj"),
    selectedConnection: sync("general/selectedConnection"),
    fileManager: get("general/fileManager.files"),
    connections: sync("general/connections"),
    metadata: get("general/getMetadata"),
    createNewConnection: sync("general/createNewConnection"),
    loadMetadata: get("general/loadMetadata"),
    drawer: sync("general/drawer"),
    selectedConnectionManager: sync("general/selectedConnectionManager"),
    leftDrawerBottom: sync("general/leftDrawerBottom"),
    saveFileDialog: sync("general/saveFileDialog"),
    connectionsList: get("general/getConnectionList"),
    query: {
      get: get("general/getCurrentQuery"),
      set(value) {
        this.$store.commit("general/setCurrentQuery", value);
      }
    }
  },
  methods: {
    updateMetadata() {
      this.$store.dispatch("general/actMetadata");
    },
    async expandMetadataTree(item) {
      let metadataItem = {
        database: this.selectedConnectionObj.name,
        catalog: item.objectName
      };
      const children = await axios.post(
        "http://localhost:4000/metadataObject",
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
    openFile(fileObj) {
      this.$store.dispatch("general/openFile", fileObj);
    },
    deleteFile(fileObj) {
      this.$store.dispatch("general/deleteFile", fileObj);
    },
    generateSelect(item) {
      this.query = `${this.query} \n\nSELECT * FROM ${item.catalog}.${item.objectName};`;
      console.log(item);
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


</style>

