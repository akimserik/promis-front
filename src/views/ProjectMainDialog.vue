<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on }">
      <v-btn small outlined color="primary" dark class="mb-2" v-on="on"
        ><v-icon left>mdi-plus-circle-outline</v-icon>Add new</v-btn
      >
    </template>

    <v-card>
      <NotificationContainer />

      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>

      <v-card-text>
        <v-container>
          <h2>Main</h2>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.clientName"
                label="Client name"
                required
                :error-messages="clientNameErrors"
                @blur="$v.editedItem.clientName.$touch()"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.targetName"
                label="Target name"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.engagementCode"
                label="Engagement code"
                required
                :error-messages="engagementCodeErrors"
                @blur="$v.editedItem.engagementCode.$touch()"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="serviceLines"
                v-model="editedItem.serviceLine"
                label="Service line"
                required
                :error-messages="serviceLineErrors"
                @blur="$v.editedItem.serviceLine.$touch()"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.contractSubject"
                label="Contract subject"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.location"
                label="Location"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="mt-5"><h2>People</h2></div>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="partners"
                v-model="editedItem.partner"
                item-text="name"
                return-object
                label="Partner"
                required
                :error-messages="partnerErrors"
                @blur="$v.editedItem.partner.$touch()"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="managers"
                v-model="editedItem.manager"
                item-text="name"
                return-object
                label="Manager"
                required
                :error-messages="managerErrors"
                @blur="$v.editedItem.manager.$touch()"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="inCharges"
                v-model="editedItem.inCharge"
                item-text="name"
                return-object
                label="In charge"
              ></v-select>
            </v-col>
          </v-row>

          <div class="mt-5"><h2>Numbers</h2></div>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.feeKZT"
                label="Fee, KZT"
                type="number"
                required
                :error-messages="feeKZTErrors"
                @blur="$v.editedItem.feeKZT.$touch()"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.budgetedHours"
                label="Budgeted hours"
                type="number"
                required
                :error-messages="budgetedHoursErrors"
                @blur="$v.editedItem.budgetedHours.$touch()"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.budgetedRealization"
                label="Budgeted realization"
                type="number"
                required
                :error-messages="budgetedRealizationErrors"
                @blur="$v.editedItem.budgetedRealization.$touch()"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.completion"
                label="Completion, %"
                type="number"
                required
                :error-messages="completionErrors"
                @blur="$v.editedItem.completion.$touch()"
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="mt-5"><h2>Dates</h2></div>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <BaseDatePicker
                :label="'Contract signed date'"
                :date="editedItem.contractSignedDate"
                v-model="editedItem.contractSignedDate"
              ></BaseDatePicker>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <BaseDatePicker
                :label="'Expected date of report'"
                :date="editedItem.expectedDateOfReport"
                v-on:input="inputExpectedDateOfReport"
                v-model="editedItem.expectedDateOfReport"
                required
                :errorMessages="expectedReportDateErrors"
                @blur="$v.editedItem.expectedDateOfReport.$touch()"
              ></BaseDatePicker>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import NotificationContainer from '@/components/NotificationContainer.vue';
import {
  required,
  maxLength,
  minLength,
  minValue,
  between,
  integer,
  decimal,
} from 'vuelidate/lib/validators';
import { serviceLines } from '@/data/catalogs.js';

export default {
  components: { NotificationContainer },
  props: {
    editedItem: Object,
    editedIndex: Number,
    employees: Object,
    inCharges: Array,
  },

  data() {
    return {
      dialog: true,
      menuContractSignedDate: false,
      menuExpectedDateOfReport: false,
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  mounted() {
    this.$v.$reset();
  },

  validations: {
    editedItem: {
      clientName: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(5),
      },
      engagementCode: {
        required,
        maxLength: maxLength(17),
        minLength: minLength(14),
      },
      feeKZT: {
        required,
        integer,
        minValue: minValue(1),
      },
      budgetedHours: {
        required,
        decimal,
        minValue: minValue(1),
      },
      budgetedRealization: {
        required,
        decimal,
        between: between(1, 100),
      },
      completion: {
        integer,
        between: between(0, 100),
      },
      partner: { required },
      manager: { required },
      serviceLine: { required },
      expectedDateOfReport: { required },
    },
  },

  computed: {
    serviceLines() {
      return serviceLines;
    },

    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },

    partners() {
      return this.employees.employees.data.data.filter(
        (employee) => employee.role == 'partner'
      );
    },

    managers() {
      return this.employees.employees.data.data.filter(
        (employee) => employee.role == 'manager'
      );
    },

    computedDateFormatted() {
      return this.formatDate(this.editedItem.contractSignedDate);
    },

    computedExpectedDateOfReportFormatted() {
      return this.formatDate(this.editedItem.expectedDateOfReport);
    },

    clientNameErrors() {
      const errors = [];
      if (!this.$v.editedItem.clientName.$dirty) return errors;
      !this.$v.editedItem.clientName.required &&
        errors.push('Client name is required');
      !this.$v.editedItem.clientName.minLength &&
        errors.push('Client name must be minimum 5 characters');
      !this.$v.editedItem.clientName.maxLength &&
        errors.push('Client name must be maximum 50 characters');
      return errors;
    },

    engagementCodeErrors() {
      const errors = [];
      if (!this.$v.editedItem.engagementCode.$dirty) return errors;
      !this.$v.editedItem.engagementCode.required &&
        errors.push('Engagement code is required');
      !this.$v.editedItem.engagementCode.minLength &&
        errors.push('Engagement code must be minimum 14 characters');
      !this.$v.editedItem.engagementCode.maxLength &&
        errors.push('Engagement code must be maximum 17 characters');
      return errors;
    },

    feeKZTErrors() {
      const errors = [];
      if (!this.$v.editedItem.feeKZT.$dirty) return errors;
      !this.$v.editedItem.feeKZT.required &&
        errors.push('Fee, KZT is required');
      !this.$v.editedItem.feeKZT.integer &&
        errors.push('Fee, KZT must be a whole number');
      !this.$v.editedItem.feeKZT.minValue &&
        errors.push('Fee, KZT must be positive integer number > 0');
      return errors;
    },

    budgetedHoursErrors() {
      const errors = [];
      if (!this.$v.editedItem.budgetedHours.$dirty) return errors;
      !this.$v.editedItem.budgetedHours.required &&
        errors.push('Budgeted hours is required');
      !this.$v.editedItem.budgetedHours.decimal &&
        errors.push('Budgeted hours must be a whole number');
      !this.$v.editedItem.budgetedHours.minValue &&
        errors.push('Budgeted hours must be positive integer number > 0');
      return errors;
    },

    budgetedRealizationErrors() {
      const errors = [];
      if (!this.$v.editedItem.budgetedRealization.$dirty) return errors;
      !this.$v.editedItem.budgetedRealization.required &&
        errors.push('Budgeted realization % is required');
      !this.$v.editedItem.budgetedRealization.decimal &&
        errors.push('Budgeted realization % must be a number');
      !this.$v.editedItem.budgetedRealization.between &&
        errors.push('Budgeted realization % must be between 0-100');
      return errors;
    },

    completionErrors() {
      const errors = [];
      if (!this.$v.editedItem.completion.$dirty) return errors;
      !this.$v.editedItem.completion.integer &&
        errors.push('Completion % must be a number');
      !this.$v.editedItem.completion.between &&
        errors.push('Completion % must be between 0-100');
      return errors;
    },

    partnerErrors() {
      const errors = [];
      if (!this.$v.editedItem.partner.$dirty) return errors;
      !this.$v.editedItem.partner.required &&
        errors.push('Partner is required');
      return errors;
    },

    managerErrors() {
      const errors = [];
      if (!this.$v.editedItem.manager.$dirty) return errors;
      !this.$v.editedItem.manager.required &&
        errors.push('Manager is required');
      return errors;
    },

    serviceLineErrors() {
      const errors = [];
      if (!this.$v.editedItem.serviceLine.$dirty) return errors;
      !this.$v.editedItem.serviceLine.required &&
        errors.push('Service Line is required');
      return errors;
    },

    expectedReportDateErrors() {
      const errors = [];
      if (!this.$v.editedItem.expectedDateOfReport.$dirty) return errors;
      !this.$v.editedItem.expectedDateOfReport.required &&
        errors.push('Expected Date Of Report is required');
      return errors;
    },
  },

  methods: {
    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          this.$store
            .dispatch('projects/updateProject', this.editedItem)
            .then(() => {
              this.close();
            });
        } else {
          this.$store
            .dispatch('projects/createProject', this.editedItem)
            .then(() => {
              this.close();
            });
        }
      }
    },

    close() {
      this.dialog = false;
      this.$v.$reset();
      this.$emit('closeMainDialog');
    },

    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.substr(0, 10).split('-');
      return `${day}/${month}/${year}`;
    },

    inputExpectedDateOfReport() {
      this.$v.editedItem.expectedDateOfReport.$touch();
    },
  },
};
</script>
