<template>
    <div>
        <v-progress-linear v-if="this.queryProgressBar == false" color="yellow darken-2"></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == true" color="yellow darken-2" indeterminate></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == 'success'" color="green darken-2"></v-progress-linear>
        <v-progress-linear v-if="this.queryProgressBar == 'failed'" color="red darken-2"></v-progress-linear>
        <v-tabs>
            <v-tab key="1">Result</v-tab>
            <v-tab key="2">Compiled SQL</v-tab>
            <v-tab key="3">Output</v-tab>

            <v-tab-item key="1">
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
                          :items-per-page="5"
                          hide-default-footer
                          disable-pagination
                      ></v-data-table>
                      <mugen-scroll :handler="loadMoreResults" :should-handle="Boolean(item.query)"></mugen-scroll>
                    </div>
                    <div v-else>
                      {{item.query}} - {{item.result}}
                    </div>
                  </v-tab-item>
                </v-tabs>
                
              </div>
            </v-tab-item>

            <v-tab-item key="2">
              <v-textarea
              disabled
              no-resize
              auto-grow
              v-model="compiled"
              ></v-textarea>
            </v-tab-item>

            <v-tab-item key="3">
              <v-textarea
              disabled
              no-resize
              auto-grow
              v-model="output"
              ></v-textarea>
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
        resultTableTab : 0
      }
    },
    computed: {
        compiled() {
            return nunjucks.renderString(this.query,this.schema)
        },

        schema : get('general/schema'),
        output : get("general/output"),
        selectedTab: sync("general/selectedTab"),
        tabs: sync("general/tabs"),
        queryProgressBar: get("general/queryProgressBar"),
        resultTable : get('general/resultTable'),
        query() {
            return this.tabs[this.selectedTab].query
        },

    },
    methods: {
        loadMoreResults() {
            this.$store.dispatch("general/loadMoreResults", this.resultTableTab)
        },
        headers(row) {
          return Object.keys(row).map((item)=> {
            return { text: item, value: item }
          })
        },
    }
}
</script>