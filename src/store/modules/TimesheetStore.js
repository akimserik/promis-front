import apiService from '@/services/apiService.js';

export const namespaced = true;

export const state = {
  timesheet: {
    data: {
      data: [],
    },
    requestedAt: Date,
    results: 0,
    status: '',
  },
};

export const mutations = {
  SET_TIMESHEET(state, timesheet) {
    state.timesheet = timesheet;
  },

  UPDATE_TIMESHEET() {
    // state.timesheet.data.stats.splice(
    //   state.timesheet.data.stats.findIndex((el) => el.id == timesheet.doc_id),
    //   1,
    //   timesheet
    // );
  },

  ADD_TIMESHEET() {
    // state, timesheet
    // // Find through Array Level 1 - Projects
    // const arrL1Projects = state.timesheet.data.stats.find(
    //   (elProj) => elProj._id === timesheet.project
    // );
    // // Increase total hours
    // arrL1Projects.hours = arrL1Projects.hours + timesheet.hours;
    // // Find proper date through Array Level 2 - Dates
    // // if date not found - add new date
    // const arrL2Date = arrL1Projects.dates.find(
    //   (elDate) => elDate.date === timesheet.date
    // );
    // if (arrL2Date) {
    //   arrL2Date.hours = arrL2Date.hours + timesheet.hours;
    //   arrL2Date.stages.push(timesheet);
    // } else {
    //   arrL1Projects.dates.push({
    //     date: timesheet.date,
    //     hours: timesheet.hours,
    //     stages: [{ ...timesheet }],
    //   });
    // }
  },

  DELETE_TIMESHEET() {},
};

export const actions = {
  fetchTimesheet({ commit, dispatch }) {
    return apiService
      .getTimesheet()
      .then((response) => {
        commit('SET_TIMESHEET', response.data);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  updateTimesheet({ commit, dispatch }, timesheet) {
    return apiService
      .updateTimesheet(timesheet)
      .then(() => {
        commit('UPDATE_TIMESHEET', timesheet);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  createTimesheet({ commit, dispatch }, timesheet) {
    return apiService
      .createTimesheet(timesheet)
      .then(() => {
        commit('ADD_TIMESHEET', timesheet);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
  deleteTimesheet({ commit, dispatch }, timesheet) {
    return apiService
      .deleteTimesheet(timesheet)
      .then(() => {
        commit('DELETE_TIMESHEET', timesheet);
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : err;
        const notification = {
          type: 'error',
          message: message,
        };
        dispatch('notification/add', notification, { root: true });
        throw err;
      });
  },
};
