import Vue from 'vue'
import axios from 'axios'
import { make, set, dispatch } from 'vuex-pathify'
import WebSocketRecon from "reconnecting-websocket";

const  state =  {
  jobs : [],
  jobPropertiesDialog : false,
  selectedJobId : null,
  jobLoaderById : [],
}

const mutations =  {
  ...make.mutations(state),
}

const getters = {
  dataServer() {
    return process.env.DATA_SERVER
  },
  selectedJob(state) {
    let selected = state.jobs.find(j => j.jobid == state.selectedJobId)
    return selected ? selected : {}
  }
}

const actions = {
  async getJobs({commit}) {
    const jobs = await axios.get(getters.dataServer() + "/jobs")
    commit("SET_JOBS", jobs.data)
  },
  async getJobsHistory({commit}) {
    const history = await axios.get(getters.dataServer() + "/jobs/history")
    commit("SET_JOBS_HISTORY", history.data)
  },
}

const wsRunningJobs = new WebSocketRecon("ws://localhost:8000/jobs/runningJobs", null, {reconnectInterval: 1000});
wsRunningJobs.addEventListener("message", function(event) {
  state.jobLoaderById = JSON.parse(event.data);
});
const wsJobHistory = new WebSocketRecon("ws://localhost:8000/jobs/jobHistory", null, {reconnectInterval: 1000});
wsJobHistory.addEventListener("message", function(event) {
  let hist = JSON.parse(event.data)
  let jobIndex = state.jobs.findIndex(j => j.jobid == hist.jobid)
  if(jobIndex >= 0) {
    let runIndex = state.jobs[jobIndex].jobshistories.findIndex(j => j.runid == hist.runid)
    if(runIndex >= 0) {
      Vue.set(state.jobs[jobIndex].jobshistories, runIndex, hist)
    } else{
      let maxIndex = state.jobs[jobIndex].jobshistories.length
      Vue.set(state.jobs[jobIndex].jobshistories, maxIndex, hist)
    }
  }
});

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    }

