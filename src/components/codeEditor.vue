<template>
    <div>
        <MonacoEditor
        height="300"
        width="1600"
        theme="vs-dark"
        language="sql"
        v-model="query"
        ></MonacoEditor>
    </div>
</template>


<script>
    import MonacoEditor from 'monaco-editor-vue';
    var request = `select * from broccoli22.items`
export default {
    components: {
        MonacoEditor
    },
    data() {
        return {
            query: request,
        }
    },
}
</script>