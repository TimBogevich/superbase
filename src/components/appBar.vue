<template>
    <div>
        <v-app-bar
        app
        clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>SQL editor </v-toolbar-title>
            <v-btn class="ml-5"  color="success" v-on:click="sendSQL">Run</v-btn>
            <v-spacer class="d-none d-sm-flex d-xs-flex"></v-spacer>
            <v-col cols="1">
                <v-text-field
                class="d-none d-sm-flex d-xs-flex"
                type="number"
                v-model="limitRows"
                label="Limit rows"
                filled
                placeholder="Limit rows"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-text-field
                class="d-none d-sm-flex d-xs-flex"
                disabled
                v-model="dataServer"
                label="Data server"
                :prepend-inner-icon="connectionIcon"
                filled
                placeholder="Placeholder"
                ></v-text-field>
            </v-col>
        </v-app-bar>
    </div>
</template>


<script>
import { get, sync, call } from 'vuex-pathify'

export default {
    computed: {

        dataServer : sync('general/dataServer'),
        limitRows : sync('general/limitRows'),
        connectionIcon : get ('general/connectionIcon'),
        drawer : sync('general/drawer'),
        showFileManager: sync("general/showFileManager"),
    },
    methods: {
        sendSQL() {
            this.$store.dispatch("general/sendSQL")
        },
    }, 
}
</script>