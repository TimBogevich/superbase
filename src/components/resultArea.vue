<template>
    <div>
        <v-progress-linear v-if="this.queryProgressBar == false" color="yellow darken-2"></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == true" color="yellow darken-2" indeterminate></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == 'success'" color="green darken-2"></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == 'failed'" color="red darken-2"></v-progress-linear>
        <v-tabs v-model="bottomPanelTab">
            <v-tab key="0">Result</v-tab>
            <v-tab key="1">Compiled SQL</v-tab>
            <v-tab key="2">Output</v-tab>
            <v-tab key="3">History</v-tab>
            <v-tab v-if="leftDrawerCatalogActive.length > 0" key="4">Properties</v-tab>

            <v-tab-item key="0">
              <div v-if="resultTable">

                <v-tabs v-model="resultTableTab">
                  <v-tooltip top v-for="(item, index) in resultTable" :key="index">
                    <template v-slot:activator="{ on }">
                      <v-tab v-on="on" >
                        {{`${index+1}. ${item.query.substring(0,15)}`}}
                      </v-tab>
                    </template>
                    <span>{{item.query}}</span>
                  </v-tooltip>
                  <v-tab-item  v-for="(item, index) in resultTable" :key="index">
                    <div v-if="item.queryType == 'query'">
                      <v-data-table 
                          :headers="headers(item.data[0])"
                          :items="item.data"
                          :item-key="item.serviceRowNumber"
                          :items-per-page="5"
                          hide-default-footer
                          disable-pagination
                          dense
                      ></v-data-table>
                      <mugen-scroll :handler="loadMoreResults" :should-handle="Boolean(!item.endCursor)"></mugen-scroll>
                    </div>
                    <div v-else>
                      {{item.query}} - {{item.result}}
                    </div>
                  </v-tab-item>
                </v-tabs>
                
              </div>
            </v-tab-item>

            <v-tab-item key="1">
              <v-textarea
              disabled
              no-resize
              auto-grow
              v-model="compiled"
              ></v-textarea>
            </v-tab-item>

            <v-tab-item key="2">
              <v-textarea
              disabled
              no-resize
              auto-grow
              v-model="output"
              ></v-textarea>
            </v-tab-item>

            <v-tab-item key="3">
              <v-text-field
                class="ml-2 mr-6"
                filled
                clearable
                label="Search"
                v-model="queryHistorySearch"
                id="id"
              ></v-text-field>
              <v-data-table
                :headers="queryHistoryHeaders"
                :items="queryHistory"
                hide-default-footer
                :search="queryHistorySearch"
                item-key="id"
                dense
              >
                <template v-slot:item.add="{ item }">
                    <v-chip @click="pasteFromHistory(item.text)">
                      <v-icon>
                        mdi-content-copy
                      </v-icon>
                      paste
                    </v-chip>
                </template>
                
              </v-data-table>
            </v-tab-item>

            <v-tab-item v-if="leftDrawerCatalogActive.length > 0" key="4">
                <v-simple-table dense>
                  <tbody>
                    <tr>
                      <td>Object type</td>
                      <td>{{ leftDrawerCatalogActive[0].objectType }}</td>
                    </tr>
                    <tr>
                      <td>Object Name</td>
                      <td>{{ leftDrawerCatalogActive[0].objectName}}</td>
                    </tr>
                  </tbody>
              </v-simple-table>

              <v-simple-table v-if="leftDrawerCatalogActive[0].columns">
                <v-flex ma-5>
                  <h3>Columns:</h3>
                </v-flex>
                
                <tbody>
                  <tr v-for="(item, index) in leftDrawerCatalogActive[0].columns" :key="index">
                    <td>{{ item.columnName}}</td>
                    <td>{{ item.columnType}}</td>
                    <td>{{ item.columnSize}}</td>
                  </tr>
                </tbody>
            </v-simple-table>
            </v-tab-item>

        </v-tabs>
    </div>
</template>


<script>
import nunjucks from "nunjucks"
import { get, sync, call } from 'vuex-pathify'
import MugenScroll from 'vue-mugen-scroll'

export default {
    components : {
        MugenScroll
    },
    data() {
      return {
        resultTableTab : 0,
        bottomPanelTab : 0,
        queryHistorySearch : "", 
        queryHistoryHeaders : [
          {text : "id", value : "id"},
          {text : "text", value : "text"},
          {text : "date", value : "date"},
          { value : "add"},
        ]
      }
    },
    computed: {
      compiled() {
          return nunjucks.renderString(this.query,this.schema)
      },
      leftDrawerCatalogActive : get("general/leftDrawerCatalogActive"),
      schema : get('general/schema'),
      output : get("general/output"),
      queryProgressBar: get("general/queryProgressBar"),
      resultTable : get('general/resultTable'),
      query: {
        get: get("general/getCurrentQuery"),
        set(value) {
          this.$store.commit("general/setCurrentQuery", value);
        }
      },
      queryHistory: get("general/queryHistory"),

    },
    watch: {
      leftDrawerCatalogActive(newLeftDrawerCatalogActive, oldLeftDrawerCatalogActive) {
        if(newLeftDrawerCatalogActive.length !== 0) {
          this.bottomPanelTab = 4
        }
        else{
          this.bottomPanelTab = 0
        }
      },
      resultTable(newResultTable, oldResultTable) {
        this.bottomPanelTab = 0
      }
    },
    methods: {
      pasteFromHistory(text) {
        this.query = `${this.query} \n\n${text}`
      },
      loadMoreResults() {
          this.$store.dispatch("general/loadMoreResults", this.resultTableTab)
      },
      headers(row) {
        var rowId = [{text : "#", value: "serviceRowNumber"}]
        var header =  Object.keys(row).filter(i => i != "serviceRowNumber").map((item)=> {
          return { text: item, value: item }
        })
        return rowId.concat(header)
      },
    }
}
</script>