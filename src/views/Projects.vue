<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="projectsArray"
      item-key="engagementCode"
      class="elevation-1"
      :search="search"
      :loading="!tableLoaded"
      loading-text="Loading... Please wait"
      show-group-by
      group-by="serviceLine"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            dense
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" fullscreen>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New Item</v-btn
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
                        item-value="_id"
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
                        item-value="_id"
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
                        item-value="_id"
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
                      <v-menu
                        v-model="menuContractSignedDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="computedDateFormatted"
                            label="Contract signed date"
                            hint="DD/MM/YYYY"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            show-current="true"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          v-model="editedItem.contractSignedDate"
                          no-title
                          @input="menuContractSignedDate = false"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menuContractSignedDate = false"
                            >Cancel</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        v-model="menuExpectedDateOfReport"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="computedExpectedDateOfReportFormatted"
                            label="Expected date of report"
                            hint="DD/MM/YYYY"
                            persistent-hint
                            prepend-icon="mdi-calendar"
                            show-current="true"
                            required
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :error-messages="expectedReportDateErrors"
                            @blur="$v.editedItem.expectedDateOfReport.$touch()"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          v-model="editedItem.expectedDateOfReport"
                          no-title
                          @input="menuExpectedDateOfReport = false"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menuExpectedDateOfReport = false"
                            >Cancel</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
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
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon v-if="isAdmin" small @click="deleteItem(item)"
          >mdi-delete</v-icon
        >
      </template>

      <template v-slot:item.feeKZT="{ item }">{{
        item.feeKZT | amount
      }}</template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  required,
  maxLength,
  minLength,
  minValue,
  between,
  integer,
  decimal,
} from 'vuelidate/lib/validators';
import { mapState } from 'vuex';
import NotificationContainer from '@/components/NotificationContainer.vue';

export default {
  name: 'ProjectsPage',
  components: { NotificationContainer },
  data() {
    return {
      dialog: false,
      search: '',
      headers: [
        { text: 'Engagement code', value: 'engagementCode', groupable: false },
        { text: 'Client name', value: 'clientName', groupable: false },
        { text: 'Fee, KZT', value: 'feeKZT', groupable: false },
        { text: 'Partner', value: 'partner.name' },
        { text: 'Manager', value: 'manager.name' },
        { text: 'Budgeted Hours', value: 'budgetedHours', groupable: false },
        {
          text: 'Budgeted Realization',
          value: 'budgetedRealization',
          groupable: false,
        },
        { text: 'Completion, %', value: 'completion', groupable: false },
        { text: 'Service Line', value: 'serviceLine' },
        {
          text: 'Contract subject',
          value: 'contractSubject',
          groupable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          groupable: false,
        },
      ],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      serviceLines: ['Audit', 'Advisory', 'Tax', 'Outsourcing'],
      menuContractSignedDate: false,
      menuExpectedDateOfReport: false,
    };
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
      partner: {
        required,
      },
      manager: {
        required,
      },
      serviceLine: {
        required,
      },
      expectedDateOfReport: {
        required,
      },
    },
  },

  mounted() {
    this.$store.dispatch('projects/fetchProjects', this.userToken);
    this.$store.dispatch('employees/fetchEmployees', this.userToken);
  },

  computed: {
    ...mapState(['projects', 'authUser', 'employees']),

    tableLoaded() {
      return this.projectsArray.length > 0;
    },

    projectsArray() {
      return this.projects.projects.data.data;
    },

    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    },

    userToken() {
      const token = localStorage.getItem('user')
        ? this.authUser.user.token
        : '';
      return token;
    },

    isAdmin() {
      return this.authUser.user.data.user.role == 'admin';
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

    inCharges() {
      return this.employees.employees.data.data.filter(
        (employee) =>
          employee.position == 'A2' ||
          employee.position == 'A3' ||
          employee.position == 'S1' ||
          employee.position == 'S2' ||
          employee.position == 'S3'
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
    editItem(item) {
      this.editedIndex = this.projectsArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.projectsArray.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.projectsArray.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$v.$reset();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editedIndex > -1) {
          this.$store
            .dispatch('projects/updateProject', this.editedItem)
            .then(() => {
              this.$store.dispatch('projects/fetchProjects', this.userToken);
              this.close();
            })
            .catch((err) => {
              this.error = err.response.data.message;
            });
        } else {
          this.$store
            .dispatch('projects/createProject', this.editedItem)
            .then(() => {
              this.$store.dispatch('projects/fetchProjects', this.userToken);
              this.close();
            })
            .catch((err) => {
              this.error = err.response.data.message;
            });
        }
      }
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.substr(0, 10).split('-');
      return `${day}/${month}/${year}`;
    },
  },
};
</script>
