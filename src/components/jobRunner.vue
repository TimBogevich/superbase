<template>
  <div>
    <multipane layout="horizontal">
      <div :style="{ height: '70%', maxHeight: '70%' }">
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
          height="300px"
          width="100%"
        >
          <v-progress-linear color="yellow darken-2"></v-progress-linear>
          <v-data-table 
          :headers="jobHistoryHeader"
          :sort-by="['start_dt']"
          sort-desc
          dense
          :items="selectedJob[0].jobshistories">
            <template v-slot:item.end_dt="{ item }">
              {{ convertDate(item.end_dt, 'DD.MM.YYYY HH:mm') }}
            </template>
            <template v-slot:item.start_dt="{ item }">
              {{ convertDate(item.start_dt, 'DD.MM.YYYY HH:mm') }}
            </template>
          </v-data-table>
        </v-sheet>
      </div>

      <v-dialog
        v-model="jobPropertiesDialog"
        scrollable
        :overlay="false"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title primary-title>Edit job</v-card-title>
          <v-card-text>
            <v-text-field name="name" label="label" id="id"></v-text-field>
          </v-card-text>
        </v-card>
      </v-dialog>
    </multipane>
  </div>
</template>


<script>
import { get, sync } from "vuex-pathify";
import { Multipane, MultipaneResizer } from "vue-multipane";


export default {
  components: {
    Multipane,
    MultipaneResizer
  },
  data() {
    return {
      jobHistoryBottom: false,
      jobHeader: [
        { text: "Job Id", value: "jobid" },
        { text: "Pattern", value: "pattern" },
        { text: "Command", value: "command" },
        { text: "Last update", value: "updatedAt" },
        { text: "Status", value: "status" }
      ],
      jobHistoryHeader: [
        { text: "Command", value: "command" },
        { text: "Start", value: "start_dt" },
        { text: "End", value: "end_dt" },
        { text: "Status", value: "status" }
      ]
    };
  },
  watch: {

  },
  methods: {
  },
  computed: {
    jobs: get("jobRunner/jobs"),
    jobPropertiesDialog: sync("jobRunner/jobPropertiesDialog"),
    selectedJob: get("jobRunner/selectedJob"),
    jobLoaderById: get("jobRunner/jobLoaderById"),
    convertDate: get("general/convertDate"),
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