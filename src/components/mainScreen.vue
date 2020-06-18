<template>
  <div>
    <leftDrawer />
    <appBar />
    <v-content>
        <div v-if="leftDrawerBottom in [0,1]"> 
            <multipane layout="horizontal"> 
                  <codeEditor  />
                <multipane-resizer></multipane-resizer>
                <v-row >
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
  padding: 0px !important;
  padding-left: 12px !important;
}
#BottomPanel {
  padding: 0px !important;
  padding-left: 12px !important;
}
</style>