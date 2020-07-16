<template>
  <div>
    <multipane layout="horizontal">
      <div :style="{ height: '480px', maxHeight: '480px', minHeight: '480px' }">
        <v-data-table
          :headers="jobHeader"
          :items="jobs"
          item-key="jobid"
          disable-sort
          hide-default-footer
          dense
        >
          <template v-slot:item.updatedAt="{ item }">
            {{ convertDate(item.updatedAt, 'DD.MM.YYYY HH:mm') }}
          </template>
        </v-data-table>
      </div>

      <multipane-resizer></multipane-resizer>
      <div :style="{ height: '300px', maxHeight: '300px' }">
        <v-sheet
          v-if="selectedJob.length != 0"
          class="scrollableContainer"
          height="420px"
          width="100%"
        >
          <v-progress-linear color="yellow darken-2"></v-progress-linear>
          <v-data-table 
          :headers="jobHistoryHeader"
          :sort-by="['start_dt']"
          sort-desc
          hide-default-footer
          disable-pagination
          dense
          :items="selectedJob[0].jobshistories">
            <template v-slot:item.end_dt="{ item }">
              {{ convertDate(item.end_dt, 'DD.MM.YYYY  HH:mm:ss') }}
            </template>
            <template v-slot:item.start_dt="{ item }">
              {{ convertDate(item.start_dt, 'DD.MM.YYYY  HH:mm:ss') }}
            </template>
            <template v-slot:item.duration="{ item }">
              {{ convertInterval(item.start_dt, item.end_dt) }}
            </template>
          </v-data-table>
        </v-sheet>
      </div>
    </multipane>

    <v-dialog
      v-if="jobForEdit"
      :value="jobForEdit"
      @click:outside="jobForEdit=null"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="pa-3">
        <v-card-title primary-title>
          Edit job
        </v-card-title>
        <v-card-text>
          <v-text-field 
          label="Name"
          v-model="jobForEdit.name">
          </v-text-field>
          <v-text-field 
          label="Cron pattern"
          :value="jobForEdit.pattern">
          </v-text-field>
          <v-text-field 
          label="Command"
          :value="jobForEdit.command">
          </v-text-field>
          <v-switch
            v-model="jobForEdit.status"
            false-value="unscheduled"
            true-value="scheduled"
            label="Scheduled / Unscheduled"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="jobEditSave(jobForEdit)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { get, sync } from "vuex-pathify";
import { Multipane, MultipaneResizer } from "vue-multipane";

export default {
  components: {
    Multipane,
    MultipaneResizer,
  },
  data() {
    return {
      jobHistoryBottom: false,
      dialogTableEdit : true,
      jobHeader: [
        { text: "Job Id", value: "jobid" },
        { text: "Job name", value: "name"},
        { text: "Pattern", value: "pattern"},
        { text: "Command", value: "command"},
        { text: "Last update", value: "updatedAt" },
        { text: "Status", value: "status" },
      ],
      jobHistoryHeader: [
        { text: "Command", value: "command" },
        { text: "Start", value: "start_dt" },
        { text: "End", value: "end_dt" },
        { text: "Duration", value: "duration" },
        { text: "Status", value: "status" }
      ]
    };
  },
  watch: {

  },
  methods: {
    jobEditSave(job) {
      this.$store.dispatch("jobRunner/jobEditSave", job)
      
    }
  },
  computed: {
    jobs: get("jobRunner/jobs"),
    selectedJob: get("jobRunner/selectedJob"),
    jobLoaderById: get("jobRunner/jobLoaderById"),
    jobForEdit : sync('jobRunner/jobForEdit'),
    convertDate: get("general/convertDate"),
    convertInterval: get("general/convertInterval"),
  },
  created: async function() {
    const jobs = this.$store.dispatch("jobRunner/getJobs");
  }
};
</script>

<style>

.scrollableContainer {
  overflow: auto;
}

a {
  color: aliceblue !important;
}

</style>