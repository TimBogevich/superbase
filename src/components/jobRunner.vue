<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Job Id</th>
            <th class="text-left">Cron pattern</th>
            <th class="text-left">Command</th>
            <th class="text-left">Status</th>
            <th class="text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in jobs" :key="item.jobid">
            <td>{{ item.jobid }}</td>
            <td>{{ item.pattern }}</td>
            <td>{{ item.command }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.createdt }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog
      v-model="jobPropertiesDialog"
      scrollable 
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          Edit job
        </v-card-title>
        <v-card-text>
          <v-text-field
            name="name"
            label="label"
            id="id"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>


<script>
import { get, sync} from "vuex-pathify";


export default {

  data() {
    return {
      header : [
        {text : "Job Id", value : "jobid"},
        {text : "Start datetime", value : "start_dt"},
        {text : "End datetime", value : "end_dt"},
        {text : "Command", value : "command"},
        {text : "Status", value : "status"},
      ]
    }
  },
  computed: {
    jobs : sync("jobRunner/jobs"),
    jobsHistory : sync("jobRunner/jobsHistory"),
    jobPropertiesDialog : sync("jobRunner/jobPropertiesDialog")
  },
  created: async function() {
    const history = await this.$store.dispatch("jobRunner/getJobsHistory")
  }
}

</script>