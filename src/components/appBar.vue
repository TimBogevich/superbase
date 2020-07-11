<template>
    <div>
        <v-app-bar
        app
        clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Superbase </v-toolbar-title>
            <v-btn v-if="leftDrawerBottom==0" class="ml-5"  color="success" v-on:click="sendSQL">Run</v-btn>
            <v-spacer class="d-none d-sm-flex d-xs-flex"></v-spacer>
            <v-flex xs1 v-if="leftDrawerBottom==0">
              <v-text-field
              class="d-none d-sm-flex d-xs-flex"
              type="number"
              v-model="limitRows"
              label="Limit rows"
              filled
              placeholder="Limit rows"
              ></v-text-field>
            </v-flex>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">{{connectionIcon}}</v-icon>
                  </v-btn>
                </template>
                <span>Data server {{dataServer}}</span>
              </v-tooltip>
        </v-app-bar>
    </div>
</template>


<script>
import { get, sync, call } from 'vuex-pathify'

export default {
    computed: {
      leftDrawerBottom: sync("general/leftDrawerBottom"),
      dataServer : get('general/dataServer'),
      limitRows : sync('general/limitRows'),
      batchSize : sync('general/batchSize'),
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