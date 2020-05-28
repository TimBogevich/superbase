<template>
    <div>
        <v-tabs append-icon="mdi-plus" v-model="selectedTab">
            <v-tab
            @click.middle="closeTab(index)" 
            v-for="(item, index) in tabsExt" :key="index">
                 {{ item.tabInfo}}
            </v-tab>
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
            cmOptions: {
                tabSize: 4,
                mode: 'text/x-sql',
                theme: 'ayu-mirage',
                lineNumbers: true,
                line: true,
                // more CodeMirror options...
            }
        }
    },
    computed:{
        selectedTab: sync("general/selectedTab"),
        tabs: sync("general/tabs"),
        tabsExt() {
            return this.tabs.map(item => {
                let tabInfo = item.filename || item.query.trim().substring(0,10) || "new file"
                return {query: item.query, tabInfo : tabInfo }
                if (item.query == "") {
                }
                else {
                    return {query: item.query, tabInfo }
                }
            })
        },
        query: {
            get() {
                return this.tabs[this.selectedTab].query
            },
            set(data) {
                this.tabs[this.selectedTab].query = data
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
        closeTab(tabIndex) {
            this.$store.dispatch("general/closeTab", tabIndex)
        }
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