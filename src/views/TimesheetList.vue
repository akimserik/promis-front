<template>
  <v-container fluid>
    <v-data-table
      :headers="headersTimesheet"
      :items="itemsTimesheet"
      class="elevation-1"
      dense
      item-key="engagementCode"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            min-width="200px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="computedDateFormatted"
                label="Week"
                readonly
                v-on="on"
                dense
                hide-details
                class="shrink"
              ></v-text-field>
            </template>

            <v-date-picker
              v-model="date"
              :show-current="showCurrent"
              first-day-of-week="1"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>

          <v-btn
            small
            class="mx-2"
            outlined
            color="success"
            @click="previousNextWeek(-7)"
            ><v-icon left>mdi-arrow-left</v-icon>prev.week
          </v-btn>
          <v-btn
            small
            class="mx-2"
            outlined
            color="success"
            @click="previousNextWeek(7)"
          >
            next week
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            small
            outlined
            color="primary"
            dark
            class="mr-2"
            @click="addNewProject"
          >
            <v-icon left>mdi-plus-circle-outline</v-icon> Add new project</v-btn
          >

          <ProjectSelectionDialog
            v-if="dialogAddNewProject"
            :currentEmployee="currentEmployee"
            :usedProjects="usedProjects"
            @closeDialogAddNewProject="closeDialogAddNewProject"
          >
          </ProjectSelectionDialog>

          <TimesheetEditionDialog
            v-if="dialogTSEdit"
            :editedItem="editedItem"
            @closeTimesheetEditionDialog="closeTimesheetEditionDialog"
          >
          </TimesheetEditionDialog>
        </v-toolbar>
      </template>

      <template slot="header">
        <thead>
          <tr class="grey lighten-2">
            <th :colspan="3">Total hours</th>
            <th v-for="day in currentWeekDays" :key="day">
              <v-chip
                x-small
                dark
                :class="{
                  'color red': sumDailyHours(day) < 8 && !isWeekend(day),
                  'color green': sumDailyHours(day) >= 8 && !isWeekend(day),
                }"
                >{{ sumDailyHours(day) }}</v-chip
              >
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.engagementCode }}</td>
          <td>{{ item.clientName }}</td>
          <td>
            <v-chip small> {{ item.hoursYTD }} </v-chip>
          </td>
          <td
            v-for="day in currentWeekDays"
            :key="day"
            @click="onRowClick(item, day)"
          >
            {{ item[day] }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import TimesheetEditionDialog from '@/components/TimesheetEditionDialog.vue';
import ProjectSelectionDialog from '@/components/ProjectSelectionDialog.vue';
import {
  dateToLocalFormat,
  formatDate,
  parseDate,
  getWeekDayName,
} from '@/plugins/dateConverter.js';
import { mapState } from 'vuex';

export default {
  name: 'TimesheetList',
  components: { TimesheetEditionDialog, ProjectSelectionDialog },

  created() {
    this.$store.dispatch('timesheet/fetchTimesheet').then(() => {
      this.timesheetRecords = this.timesheet.timesheet.data.stats;
      this.setItemsTimesheet();
    });
    this.date = this.startOfWeek(this.date);
  },

  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: formatDate(new Date().toISOString().substr(0, 10)),
    showCurrent: true,
    menu: false,
    dialogTSEdit: false,
    dialogAddNewProject: false,
    editedItem: {},
    timesheetRecords: [],
    itemsTimesheet: [],
  }),

  computed: {
    ...mapState(['timesheet', 'authUser']),

    computedDateFormatted() {
      return formatDate(this.date);
    },

    currentWeekDays() {
      const nextDay = new Date(this.date);
      const arrDays = [dateToLocalFormat(this.date)];

      for (let index = 0; index < 6; index++) {
        nextDay.setDate(nextDay.getDate() + 1);
        arrDays.push(dateToLocalFormat(nextDay.toISOString().substr(0, 10)));
      }

      return arrDays;
    },

    headersTimesheet() {
      const arrRes = [
        {
          text: 'Code',
          value: 'engagementCode',
          width: '100px',
        },
        {
          text: 'Name',
          value: 'clientName',
          width: '200px',
        },
        {
          text: 'Hours YTD',
          value: 'hoursYTD',
          border: 'right',
        },
      ];

      this.currentWeekDays.forEach((day) => {
        arrRes.push({
          text: `${day}\r\n(${getWeekDayName(day)})`,
          value: day,
        });
      });

      return arrRes;
    },

    currentEmployee() {
      return this.authUser.user.data.user;
    },

    usedProjects() {
      let result = this.itemsTimesheet.map((a) => a.project);
      return result;
    },
  },

  watch: {
    date(val) {
      this.dateFormatted = formatDate(this.date);
      this.date = this.startOfWeek(val);
    },
  },

  methods: {
    setItemsTimesheet() {
      this.itemsTimesheet = [];
      this.timesheetRecords.forEach((record) => {
        const newRecord = {
          project: record._id,
          engagementCode: record.project.engagementCode,
          clientName: record.project.clientName,
          projectStages: record.project.stages,
          dates: record.dates,
          employee: this.currentEmployee._id,
          hoursYTD: record.hours,
        };

        record.dates.forEach((date) => {
          let datetoDisplay = formatDate(date.date);
          newRecord[datetoDisplay] = date.hours;
        });

        this.itemsTimesheet.push(newRecord);
      });
    },

    onRowClick(item, day) {
      this.editedItem = Object.assign({}, item);
      this.editedItem.day = day;
      this.dialogTSEdit = true;
    },

    sumDailyHours(key) {
      return this.itemsTimesheet.reduce(
        (a, b) => Number(a) + (Number(b[key]) || 0),
        0
      );
    },

    isWeekend(day) {
      const d = new Date(parseDate(day));
      if (d.getDay() === 0 || d.getDay() === 6) {
        return true;
      }
      return false;
    },

    startOfWeek(dateString) {
      const dateToFormat = new Date(dateString);
      const diff =
        dateToFormat.getDate() -
        dateToFormat.getDay() +
        (dateToFormat.getDay() === 0 ? -6 : 1);

      return new Date(dateToFormat.setDate(diff)).toISOString().substr(0, 10);
    },

    previousNextWeek(numberOfdays) {
      const dateToConvert = new Date(parseDate(this.dateFormatted));
      const diff = dateToConvert.getDate() + numberOfdays;
      this.date = new Date(dateToConvert.setDate(diff))
        .toISOString()
        .substr(0, 10);
    },

    closeTimesheetEditionDialog() {
      this.dialogTSEdit = false;
      this.$store.dispatch('timesheet/fetchTimesheet').then(() => {
        this.timesheetRecords = this.timesheet.timesheet.data.stats;
        this.setItemsTimesheet();
      });
    },

    closeDialogAddNewProject(value) {
      if (value) {
        const newRecord = {
          project: value._id,
          engagementCode: value.engagementCode,
          clientName: value.clientName,
          projectStages: value.stages,
          dates: [],
          employee: this.currentEmployee._id,
        };

        this.itemsTimesheet.push(newRecord);
      }
      this.dialogAddNewProject = false;
    },

    addNewProject() {
      this.dialogAddNewProject = true;
    },
  },
};
</script>

<style lang="scss">
.cell-right-border {
  border-right: 1px solid #000;
}
</style>
