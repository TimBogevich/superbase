<template>
    <div>
        <leftDrawer />
        <appBar />
        <v-content>
            <v-row> 
                <v-col
                id="codeEditor"
                cols="12">
                    <codeEditor />
                </v-col>
            </v-row>
            <v-row>
                <v-col
                cols="12">
                    <resultArea />
                </v-col>
            </v-row>
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



export default {
    components: {codeEditor,leftDrawer, appBar,resultArea, fileSaver},
}
</script>

<style >
    #codeEditor {
        padding: 0px;
    }
</style>