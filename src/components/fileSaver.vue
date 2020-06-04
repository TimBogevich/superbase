<template>
  <v-layout row justify-center>
    <v-dialog v-model="showFileManager" persistent max-width="290">
     <v-progress-linear :indeterminate="fileManagerLoading"></v-progress-linear>
      <v-card>
        <v-card-title class="headline">Save file</v-card-title>
        <v-list>
        <v-list-item-group v-model="selected" color="primary">
            <v-list-item
            v-for="(file, i) in fileManager.children"
            :key="i"
            >
            <v-list-item-icon>
                <v-icon v-if="file.type=='file'">mdi-file</v-icon>
                <v-icon v-if="file.type=='directory'">mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-text="file.name"></v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        </v-list>
        <v-text-field
        class="d-none d-sm-flex d-xs-flex"
        v-model="filename"
        filled
        autocomplete="off"
        placeholder="file name"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeTab()">Don't save</v-btn>
          <v-btn color="gray darken-1" @click="showFileManager = false">Close</v-btn>
          <v-btn color="green darken-1" @click="saveFile()">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
import { get,sync } from 'vuex-pathify'

export default {
    data () {
      return {
        selected : null,
        filename : null
      }
    },
    computed : {
      showFileManager: sync("general/showFileManager"),
      tabForSaveOrClose : sync("general/tabForSaveOrClose"),
      fileManager : get("general/fileManager.files"),
      fileManagerLoading : get("general/fileManagerLoading"),
      leftDrawerBottom : sync("general/leftDrawerBottom"),
    },
    methods : {
      saveFile() {
        this.$store.dispatch("general/saveFile", {filename : this.filename, tabIndex : this.tabForSaveOrClose})
        this.showFileManager = false
        this.$store.dispatch("general/getFiles")
        this.leftDrawerBottom = 1
        this.tabForSaveOrClose = null
      },
      closeTab() {
        this.$store.dispatch("general/closeTab", this.tabForSaveOrClose)
        this.showFileManager = false
        this.tabForSaveOrClose = null
      }
    }
}
</script>