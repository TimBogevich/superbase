<template>
    <div>
        <codemirror 
        v-model="query" 
        @ready="onCodemirrorReady"
        :options="cmOptions" />
    </div>
</template>


<script>
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/mode/sql/sql'
import { get,sync } from 'vuex-pathify'

export default {
    data() {
        return {
            cmOptions: {
                tabSize: 4,
                mode: 'text/x-sql',
                theme: 'ayu-mirage',
                lineNumbers: true,
                line: true,
                // more CodeMirror options...
            }
        }
    },
    computed:{
        query: sync("general/query")
            
    },
    methods: {
        onCodemirrorReady (cm) {
            cm.on('keypress', () => {
                cm.showHint({completeSingle:false})
            })
        }
    },
}
</script>