<template>
    <div>
        <v-app-bar
        app
        clipped-left>
            <v-toolbar-title>File manager </v-toolbar-title>
            <v-spacer></v-spacer>
            <router-link to="/">
                <v-btn color="red">Back</v-btn>
            </router-link>
        </v-app-bar>
        <v-content>
            <v-container grid-list-md>
                  <v-card>
                    <v-toolbar flat color="gray" dark>
                    <v-toolbar-title>Files in Store</v-toolbar-title>
                    </v-toolbar>
                    <v-tabs
                    vertical>
                    <v-tab
                    right
                    v-for="(item, index) in fileManager.files" :key="index">
                        <v-icon left>mdi-file</v-icon>
                        {{item}}
                    </v-tab>

                    <v-tab-item
                    v-for="(item, index) in fileManager.files" :key="index">
                        <p>
                            In order to run file {{item}} please excute following post request
                        </p>
                        <p>
                            curl -d '{"database" : "broccoli", "filename" : "{{item}}" }' -H 'Content-Type: application/json' {{dataServer}}
                        </p>
                    </v-tab-item>
                    </v-tabs>
                </v-card>
            </v-container>
        </v-content>
    </div>
</template>


<script>
import { get,sync } from 'vuex-pathify'

export default {
    computed: {
        dataServer : get("general/dataServer"),
        fileManager : get("general/fileManager"),
    },
    created: function() {
        this.$store.dispatch("general/getFiles")
    }
}
</script>