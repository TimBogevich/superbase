<template>
    <div>
        {{connections}}
    </div>
</template>


<script>
export default {
    computed: {
        connections() {
            return this.$store.getters.getConnection
        }
    },
}
</script>