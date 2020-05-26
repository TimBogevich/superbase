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
                <v-data-table
                    :headers="headers"
                    :items="resultTable.data"
                    :items-per-page="5"
                    hide-default-footer
                    disable-pagination
                ></v-data-table>
                <mugen-scroll :handler="loadMoreResults" :should-handle="Boolean(this.resultTable.query)"></mugen-scroll>
            </v-tab-item>
            <v-tab-item key="2">
                <v-textarea
                disabled
                no-resize
                auto-grow
                v-model="result"
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
    computed: {
        result : function() {
            return nunjucks.renderString(this.query,this.schema)
        },
        headers: function() {
            return Object.keys(this.resultTable.data[0]).map((item)=> {
                    return { text: item, value: item }
                })
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
            this.$store.dispatch("general/loadMoreResults")
        },
    }
}
</script>