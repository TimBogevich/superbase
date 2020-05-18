<template>
  <v-layout row justify-center>
    <v-dialog v-model="showFileManager" persistent max-width="290">
     <v-progress-linear :indeterminate="fileManagerLoading"></v-progress-linear>
      <v-card>
        <v-card-title class="headline">Save file</v-card-title>
        <v-list>
        <v-list-item-group v-model="selected" color="primary">
            <v-list-item
            v-for="(filename, i) in fileManager.files"
            :key="i"
            >
            <v-list-item-icon>
                <v-icon>mdi-file</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title v-text="filename"></v-list-item-title>
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
        fileManager : get("general/fileManager"),
        fileManagerLoading : get("general/fileManagerLoading")
    },
    methods : {
        saveFile() {
            this.$store.dispatch("general/saveFile", this.filename)
        }
    }
}
</script>