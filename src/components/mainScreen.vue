<template>
  <div>
    <leftDrawer />
    <appBar />
    <v-content>
        <div v-if="leftDrawerBottom in [0,1]"> 
            <multipane class="horizontal-panes" layout="horizontal">
                <v-row>
                <v-col id="codeEditor" cols="12">
                    <codeEditor />
                </v-col>
                </v-row>
                <multipane-resizer></multipane-resizer>
                <v-row>
                <v-col id="BottomPanel" cols="12">
                    <resultArea />
                </v-col>
                </v-row>
            </multipane>
            <fileSaver />
        </div>
 
        <div v-if="leftDrawerBottom==2">
            <connectionManager absolute />
        </div>
    </v-content>


  </div>
</template>

<script>
import codeEditor from "./codeEditor";
import leftDrawer from "./leftDrawer";
import appBar from "./appBar";
import resultArea from "./resultArea";
import fileSaver from "./fileSaver";
import connectionManager from "./connectionManager";
import { Multipane, MultipaneResizer } from "vue-multipane";
import { sync } from 'vuex-pathify'

export default {
  components: {
    codeEditor,
    leftDrawer,
    appBar,
    resultArea,
    fileSaver,
    Multipane,
    MultipaneResizer,
    connectionManager
  },
  computed: {
      leftDrawerBottom : sync("general/leftDrawerBottom"),
  },
};
</script>

<style >
#codeEditor {
  padding: 0px;
  padding-left: 12px;
}
#BottomPanel {
  padding: 0px;
  padding-left: 12px;
}
</style>