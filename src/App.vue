<template>
<v-app>
  <div >
    <transition>
        <router-view/>
    </transition>
  </div>
</v-app>
</template>

<script>
export default {
    name: 'App',    
    created: async function() {
      const connection = await this.$store.dispatch("connection/connectToDataServer")
      const metadata = this.$store.dispatch("general/actMetadata")
      const files = this.$store.dispatch("general/getFiles")
      Promise.all([metadata, files])
    }
}
</script>

<style>

.theme--dark.v-application {
    background: #1e1e1e !important;
}
</style>

