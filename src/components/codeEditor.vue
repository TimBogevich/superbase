<template>
    <div>
        <v-tabs append-icon="mdi-plus" v-model="selectedTab">
                <v-hover v-for="(item, index) in tabsExt" :key="index"
                v-slot:default="{ hover }"
                >
                    <v-tab>
                        {{ item.tabInfo}}
                        <v-btn icon @click="closeTab(index)" >
                            <v-icon v-if="hover" small>mdi-close</v-icon>
                            <v-icon v-else-if="item.edited==true" color="grey darken-1">mdi-circle-medium</v-icon>
                        </v-btn>
                    </v-tab>
                </v-hover>
            <v-btn 
            @click="addTab()"
            color="gray"
            class="align-self-center mr-4">
                NEW
                <v-icon right>mdi-plus</v-icon>
            </v-btn>
        </v-tabs>
        <codemirror 
        v-model="query" 
        @ready="onCodemirrorReady"
        :options="cmOptions" />
    </div>
</template>


<script>
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/mode/sql/sql'
import { get,sync } from 'vuex-pathify'

export default {
    data() {
        return {
        }
    },
    computed:{
        tables: get("general/getTables"),
        cmOptions() {
            var tables = this.tables
            if (Object.keys(tables).length > 0 ) {
                var hintOptions = {tables}
            }
            else {
                var hintOptions = {}
            }
        
            return {
                tabSize: 4,
                mode: 'text/x-sql',
                theme: 'ayu-mirage',
                lineNumbers: true,
                line: true,
                hintOptions 
            }
        },
        selectedTab: sync("general/selectedTab"),
        showFileSaver: sync("general/showFileManager"),
        saveFileDialog : sync("general/saveFileDialog"),
        tabForSaveOrClose : sync("general/tabForSaveOrClose"),
        leftDrawerBottom: sync("general/leftDrawerBottom"),
        tabs: sync("general/tabs"),
        tabsExt() {
            return this.tabs.map(item => {
                let tabInfo = item.filename || item.query.trim().substring(0,10) || "new file"
                return {query: item.query, tabInfo : tabInfo, edited: item.edited || false }

            })
        },
        query: {
            get() {
                return this.tabs[this.selectedTab].query
            },
            set(data) {
                if (data) {
                    this.tabs[this.selectedTab].query = data
                    this.tabs[this.selectedTab].edited = true
                }
            }
        }
            
    },
    methods: {
        onCodemirrorReady (cm) {
            cm.on('keypress', () => {
                cm.showHint({completeSingle:false})
            })
        },
        addTab() {
            this.$store.dispatch("general/addNewTab")
        },
        closeTab(item) {
          this.tabForSaveOrClose = item
          this.showFileSaver = true
        },
    },
}
</script>


<style>
#vue-codemirror {
  width: auto;
}

.CodeMirror {
    background: transparent !important;
}
</style>