<template>
  <v-dialog v-model="dialogTSEdit" max-width="450px">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="editedItem.day" label="Date" readonly dense>
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="editedItem.engagementCode"
              :label="editedItem.clientName"
              readonly
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headersDailyDetails"
          :items="itemsDailyDetails"
          class="elevation-1"
          dense
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar dense flat color="white">
              <v-toolbar-title>
                Total hours: {{ totalHoursPerDay }}
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn
                icon
                small
                color="primary"
                class="mr-2"
                @click="openTSQuickEditionDialog(true)"
              >
                <v-icon left>mdi-plus-circle-outline</v-icon>
              </v-btn>

              <v-btn
                icon
                small
                color="success"
                class="mr-2"
                :disabled="selectedRow == null"
                @click="openTSQuickEditionDialog(false)"
              >
                <v-icon left>mdi-pencil-circle-outline</v-icon>
              </v-btn>

              <v-btn
                icon
                small
                color="error"
                class="mr-2"
                :disabled="selectedRow == null"
                @click="deleteTS"
              >
                <v-icon left>mdi-delete-circle</v-icon>
              </v-btn>

              <TimesheetQuickChargeDialog
                v-if="dialogQuickCharge"
                :editedItem="editedItem"
                :editedTSItem="editedTSItem"
                @close="editAddHoursOnQuickCharge"
              >
              </TimesheetQuickChargeDialog>
            </v-toolbar>
          </template>

          <template v-slot:body="{ items }">
            <tbody>
              <tr
                :class="
                  key === selectedRow
                    ? 'custom-highlight-row'
                    : 'custom-ordinary-row'
                "
                @click="onRowClick(key)"
                @dblclick="openTSQuickEditionDialog(false)"
                v-for="(item, key) in items"
                :key="item.doc_id"
              >
                <td>{{ item.stageName || 'Undefined' }}</td>
                <td>{{ item.hours }}</td>
                <td>{{ item.comment || 'No comment' }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveTS">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { dateToLocalFormat, parseDate } from '@/plugins/dateConverter.js';
import TimesheetQuickChargeDialog from '@/components/TimesheetQuickChargeDialog.vue';

export default {
  name: 'TimesheetEditionDialog',
  components: { TimesheetQuickChargeDialog },
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedRow: null,

      dialogTSEdit: true,
      dialogQuickCharge: false,
      expanded: [],

      editedIndex: -1,
      editedTSItem: {
        stageName: '',
        hours: Number,
        comment: '',
      },
      editedTSIndex: -1,
      defaultTSItem: {
        stageName: '',
        hours: Number,
        comment: '',
      },

      headersDailyDetails: [
        { text: 'Stage', value: 'stageName' },
        { text: 'Hours', value: 'hours' },
        { text: 'Comment', value: 'comment' },
      ],
      itemsDailyDetails: [],
    };
  },

  watch: {
    dialogTSEdit(val) {
      val || this.close();
    },
  },

  created() {
    this.getItemsDailyDetails();
  },

  mounted() {
    this.dialogQuickCharge = !this.itemsDailyDetails.length;
  },

  computed: {
    totalHoursPerDay() {
      if (this.itemsDailyDetails.length)
        return this.itemsDailyDetails.reduce(
          (a, b) => a + (Number(b.hours) || 0),
          0
        );
      else return 0;
    },
  },

  methods: {
    getItemsDailyDetails() {
      if (this.editedItem.dates) {
        this.editedItem.dates.forEach((element) => {
          element.dateFormatted = dateToLocalFormat(element.date);
        });

        const index = this.editedItem.dates.findIndex(
          (item) => item.dateFormatted === this.editedItem.day
        );
        if (index > -1)
          this.itemsDailyDetails = this.editedItem.dates[index].stages;

        this.itemsDailyDetails.forEach((el) => {
          if (el.stage) {
            const stageObj = this.editedItem.projectStages.find(
              (elSt) => String(elSt._id) === el.stage
            );
            el.stageName = stageObj ? stageObj.name : 'Not found';
          } else el.stageName = 'Undefined';
        });
      }
    },

    close() {
      this.dialogTSEdit = false;
      this.$emit('closeTimesheetEditionDialog');
    },

    closeQuickChargeDialog() {
      this.dialogQuickCharge = false;
      this.$nextTick(() => {
        this.editedTSItem = Object.assign({}, this.defaultTSItem);
        this.editedTSIndex = -1;
      });
    },

    openTSQuickEditionDialog(addNew) {
      this.editedTSIndex = addNew ? -1 : this.selectedRow;
      this.editedTSItem = Object.assign(
        {},
        this.itemsDailyDetails[this.editedTSIndex]
      );
      this.dialogQuickCharge = true;
    },

    editAddHoursOnQuickCharge(value) {
      if (value) {
        if (this.editedTSIndex > -1)
          Object.assign(this.itemsDailyDetails[this.editedTSIndex], value);
        else {
          this.itemsDailyDetails.push(value);
        }
      }
      this.closeQuickChargeDialog();
    },

    onRowClick(rowId) {
      this.selectedRow = rowId;
    },

    saveTS() {
      this.prepareItemsBeforeSave();

      if (!this.itemsDailyDetails.length) {
        this.close();
        return;
      }

      this.itemsDailyDetails.forEach((element) => {
        if (element.doc_id) {
          // to update existing doc
          this.$store
            .dispatch('timesheet/updateTimesheet', element)
            .then(() => {
              this.close();
            });
        } else {
          // to create a new doc
          this.$store
            .dispatch('timesheet/createTimesheet', element)
            .then(() => {
              this.close();
            });
        }
      });
    },

    prepareItemsBeforeSave() {
      this.itemsDailyDetails.forEach((element) => {
        element.project = this.editedItem.project;
        element.date = parseDate(this.editedItem.day);
        element.employee = this.editedItem.employee;

        element.chargedHours = element.hours;
        element.projectStage = element.stage;
      });
    },

    deleteTS() {
      this.editedTSIndex = this.selectedRow;

      confirm('Delete selected hours?') &&
        this.$store
          .dispatch(
            'timesheet/deleteTimesheet',
            this.itemsDailyDetails[this.editedTSIndex]
          )
          .then(() => {
            this.itemsDailyDetails.splice(this.editedTSIndex, 1);
          });
    },
  },
};
</script>

<style lang="scss">
.custom-highlight-row {
  background-color: #eeeeee;
}

.custom-ordinary-row {
  background-color: transparent !important;
}
</style>
