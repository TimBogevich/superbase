<template>
    <div id="codeIditorResizable" >
        <v-tabs height="40" append-icon="mdi-plus" v-model="selectedTab">
                <v-hover v-for="(item, index) in tabsExt" :key="index"
                v-slot:default="{ hover }"
                >
                    <v-tab>
                        {{ item.tabInfo}}
                        <v-btn icon @click="closeOrSaveTab(index)" >
                            <v-icon v-if="hover" small>mdi-close</v-icon>
                            <v-icon v-else-if="item.edited==true" color="grey darken-1">mdi-circle-medium</v-icon>
                        </v-btn>
                    </v-tab>
                </v-hover>
            <v-btn 
            @click="addNewTab()"
            color="gray"
            class="align-self-center mr-4">
                NEW
                <v-icon right>mdi-plus</v-icon>
            </v-btn>
        </v-tabs>
        <codemirror 
        v-model="query" 
        ref="codemirror"
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
import { get,sync} from 'vuex-pathify'
import { mapActions } from 'vuex'


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
        codeEditorDevider: sync("general/codeEditorDevider"),
        showFileSaver: sync("general/showFileManager"),
        saveFileDialog : sync("general/saveFileDialog"),
        tabForSaveOrClose : sync("general/tabForSaveOrClose"),
        leftDrawerBottom: sync("general/leftDrawerBottom"),
        tabs: sync("general/tabs"),
        tabsExt : get("general/tabsExt"),
        query: {
            get: get("general/getCurrentQuery"),
            set(value) {
              this.$store.commit("general/setCurrentQuery", value)
            }
        },
        codemirror() {
          return this.$refs.codemirror
        },
        markedText() {
          let marks = this.$refs.codemirror.codemirror.doc.getAllMarks().pop()
          if (marks) {
            return marks.lines.map(item => item.text).join("\n")
          }
        }

    },
    methods: { 
    ...mapActions('general', [ 
      'addNewTab', 
    ]),
      onCodemirrorReady (cm) {
         cm.on('cursorActivity', () => {
          cm.eachLine((line) => {
            cm.removeLineClass(line.lineNo(), null, "selectedLine")
          })
          var devider = this.codeEditorDevider
          var line = cm.getCursor().line
          var ch = cm.getCursor().ch

          // clear marked text
          //cm.doc.getAllMarks().forEach(marker => marker.clear())

          let text = cm.doc.getValue()
          let cursorIndex = cm.doc.indexFromPos({line, ch})
          let startIndex = text.lastIndexOf(devider, cursorIndex -1) 
          startIndex = startIndex === -1 ? 0 : startIndex + devider.length
          let endIndex = text.indexOf(devider, cursorIndex)
          endIndex = endIndex === -1 ? text.length : endIndex

          let startPosition = cm.doc.posFromIndex(startIndex)
          let endPosition = cm.doc.posFromIndex(endIndex)
          for (let i = startPosition.line; i <= endPosition.line; i++) {
            cm.addLineClass(i, null, "selectedLine");
            
          } 
          //cm.markText( startPosition, endPosition, {className : "markedText"}) 

        })
        cm.on('keypress', () => {
          cm.showHint({completeSingle:false})
        })
      },
      closeOrSaveTab(item) {
        if (this.tabs[item].edited) {
          this.tabForSaveOrClose = item
          this.showFileSaver = true
        }
        else{
          this.$store.dispatch("general/closeTab", item)
        }
      },
    },
}
</script>


<style>
  .vue-codemirror {
  width: auto !important;
  height: 100% !important;
} 

#codeIditorResizable {
  height: 400px;
}

.CodeMirror {
    background: transparent !important;
    height: 100% !important;
}

.selectedLine {
  background-color: rgba(61, 61, 61, 0.884);
}

.markedText {
  background-color: rgba(44, 72, 116, 0.884);
}
</style>