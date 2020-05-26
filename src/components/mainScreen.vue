<template>
    <div>
        <leftDrawer />
        <appBar />
        <v-content>
            <multipane class="horizontal-panes" layout="horizontal">
                <v-row> 
                    <v-col
                    id="codeEditor"
                    cols="12">
                        <codeEditor />
                    </v-col>
                </v-row>
                    <multipane-resizer></multipane-resizer>
                <v-row>
                    <v-col
                    id="BottomPanel"
                    cols="12">
                        <resultArea />
                    </v-col>
                </v-row>
            </multipane>
            <fileSaver />
        </v-content>
    </div>
</template>

<script>


import codeEditor from "./codeEditor"
import leftDrawer from "./leftDrawer"
import appBar from "./appBar"
import resultArea from "./resultArea"
import fileSaver from "./fileSaver"
import { Multipane, MultipaneResizer } from 'vue-multipane';


export default {

    components: {codeEditor,leftDrawer, appBar,resultArea, fileSaver, Multipane, MultipaneResizer},
}
</script>

<style >
    #codeEditor {
        padding: 0px;
        padding-left: 12px;
    }
    #BottomPanel{
        padding: 0px;
        padding-left: 12px;
    }
</style>