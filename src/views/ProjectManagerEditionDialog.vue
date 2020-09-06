<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <NotificationContainer />

      <v-card-title>
        <span class="headline"
          >Project: {{ project.clientName }} ({{
            project.engagementCode
          }})</span
        >
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-expansion-panels inset class="mb-6">
            <v-expansion-panel class="ViewPanel">
              <v-expansion-panel-header expand-icon="mdi-menu-down"
                >Project info (expand for details)</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <p class="body-2">
                      <span class="font-weight-bold">Service line: </span>
                      {{ project.serviceLine }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold">Contract subject: </span>
                      {{ project.contractSubject }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold">Location: </span>
                      {{ project.location }}
                    </p>

                    <p class="body-2">
                      <span class="font-weight-bold">Partner: </span>
                      {{ project.partner.name }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold">Manager: </span>
                      {{ project.manager.name }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="body-2">
                      <span class="font-weight-bold">Fee (KZT): </span>
                      {{ project.feeKZT | amount }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold">Budgeted hours: </span>
                      {{ project.budgetedHours }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold"
                        >Budgeted realization (%):
                      </span>
                      {{ project.budgetedRealization }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold"
                        >Contract signed date:
                      </span>
                      {{ project.contractSignedDate | dateShort }}
                    </p>
                    <p class="body-2">
                      <span class="font-weight-bold"
                        >Expected report date:
                      </span>
                      {{ project.expectedDateOfReport | dateShort }}
                    </p>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-container class="EditionPanel">
            <v-row>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="project.completion"
                      label="Completion, %"
                      type="number"
                      dense
                      :error-messages="completionErrors"
                      @blur="$v.project.completion.$touch()"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      :items="inCharges"
                      dense
                      v-model="project.inCharge"
                      item-text="name"
                      return-object
                      label="In charge"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>

            <v-row class="mb-10">
              <v-container class="StagesTable">
                <v-data-table
                  :headers="headersStages"
                  :items="projectStages"
                  class="elevation-1"
                  dense
                  hide-default-footer
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title>Project Stages</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        outlined
                        color="primary"
                        dark
                        class="mr-2"
                        @click="dialogStage = true"
                      >
                        <v-icon left>mdi-plus-circle-outline</v-icon>
                        Add</v-btn
                      >
                      <v-dialog v-model="dialogStage" max-width="550px">
                        <v-card>
                          <v-card-title>
                            Project Stage
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col>
                                <v-text-field
                                  v-model="editedStage.name"
                                  label="Stage name"
                                  type="text"
                                  :error-messages="stageNameErrors"
                                  @blur="$v.editedStage.name.$touch()"
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="editedStage.budgetedHours"
                                  label="Budgeted hours"
                                  type="number"
                                  :error-messages="budgetedHoursErrors"
                                  @blur="$v.editedStage.budgetedHours.$touch()"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-text-field
                                v-model="editedStage.description"
                                label="Description"
                                type="text"
                              ></v-text-field>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="closeDialogStage"
                              >Cancel</v-btn
                            >
                            <v-btn color="blue darken-1" text @click="saveStage"
                              >Save</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="deleteStage(item)">mdi-delete</v-icon>
                    <v-icon small @click="editStage(item)">mdi-pencil</v-icon>
                  </template>
                </v-data-table>
              </v-container>

              <v-container class="TeamTable">
                <v-data-table
                  :headers="headersTeam"
                  :items="projectTeam"
                  class="elevation-1"
                  dense
                  hide-default-footer
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title>Assigned Team</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        small
                        outlined
                        color="primary"
                        dark
                        class="mr-2"
                        @click="dialogTeam = true"
                      >
                        <v-icon left>mdi-plus-circle-outline</v-icon>
                        Add</v-btn
                      >
                      <EmployeeSelectionDialog
                        v-if="dialogTeam"
                        @closeDialogTeam="closeDialogTeam"
                      />
                    </v-toolbar>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon small @click="deleteTeamMember(item)"
                      >mdi-delete</v-icon
                    >
                  </template>
                </v-data-table>
              </v-container>
            </v-row>
          </v-container>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
    <template v-slot:project.feeKZT="{ item }">{{
      item.feeKZT | amount
    }}</template>
  </v-dialog>
</template>

<script>
import NotificationContainer from '@/components/NotificationContainer';
import EmployeeSelectionDialog from '@/components/EmployeeSelectionDialog';
import {
  requiredIf,
  maxLength,
  between,
  integer,
} from 'vuelidate/lib/validators';

export default {
  name: 'ProjectManagerView',
  components: {
    NotificationContainer,
    EmployeeSelectionDialog,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    inCharges: {
      type: Array,
    },
  },
  data() {
    return {
      headersTeam: [
        { text: 'Employee', value: 'name' },
        { text: 'Position', value: 'position' },
        { text: 'Actions', value: 'actions' },
      ],
      headersStages: [
        { text: 'Stage', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Budgeted hours', value: 'budgetedHours' },
        { text: 'Actions', value: 'actions' },
      ],
      dialog: true,
      dialogTeam: false,
      dialogStage: false,
      projectTeam: [],
      projectStages: [],
      editedStage: {},
      editedStageDefault: {},
      editedStageIndex: -1,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogStage(val) {
      val || this.closeDialogStage();
    },
  },
  validations: {
    project: {
      completion: {
        integer,
        between: between(0, 100),
      },
    },
    editedStage: {
      budgetedHours: {
        integer,
        between: between(1, 1000),
      },
      name: {
        required: requiredIf(function () {
          return this.editedStage;
        }),
        maxLength: maxLength(30),
      },
    },
  },
  computed: {
    completionErrors() {
      const errors = [];
      if (!this.$v.project.completion.$dirty) return errors;
      !this.$v.project.completion.integer &&
        errors.push('Completion % must be a number');
      !this.$v.project.completion.between &&
        errors.push('Completion % must be between 0-100');
      return errors;
    },
    stageNameErrors() {
      const errors = [];
      if (!this.$v.editedStage.name.$dirty) return errors;
      !this.$v.editedStage.name.required &&
        errors.push('Stage name is required');
      !this.$v.editedStage.name.maxLength &&
        errors.push('Stage name must be maximum 30 characters');
      return errors;
    },
    budgetedHoursErrors() {
      const errors = [];
      if (!this.$v.editedStage.budgetedHours.$dirty) return errors;
      !this.$v.editedStage.budgetedHours.integer &&
        errors.push('Budgeted hours must be a whole number');
      !this.$v.editedStage.budgetedHours.between &&
        errors.push(
          'Budgeted hours must be a positive whole number between 0-1000'
        );
      return errors;
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('closeDialogManager');
    },
    save() {
      this.$v.project.$touch();
      if (!this.$v.project.$invalid) {
        this.$store
          .dispatch('projects/updateProject', this.project)
          .then(() => {
            this.close();
          });
      }
    },
    closeDialogTeam(value) {
      this.dialogTeam = false;
      if (value) {
        value.forEach((element) => {
          this.projectTeam.push(element);
        });
      }
    },
    deleteTeamMember(item) {
      const index = this.project.team.indexOf(item);
      confirm(
        `Are you sure you want to delete ${item.name} from project team?`
      ) && this.project.team.splice(index, 1);
    },
    editStage(item) {
      this.editedStageIndex = this.projectStages.indexOf(item);
      this.editedStage = Object.assign({}, item);
      this.$v.$reset();
      this.dialogStage = true;
    },
    deleteStage(item) {
      const index = this.project.stages.indexOf(item);
      confirm(`Are you sure you want to delete stage ${item.name}?`) &&
        this.project.stages.splice(index, 1);
    },
    closeDialogStage() {
      this.dialogStage = false;
      this.$v.$reset();
      this.$nextTick(() => {
        this.editedStage = Object.assign({}, this.editedStageDefault);
        this.editedStageIndex = -1;
      });
    },
    saveStage() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editedStageIndex > -1)
          Object.assign(
            this.projectStages[this.editedStageIndex],
            this.editedStage
          );
        else {
          this.projectStages.push(this.editedStage);
        }

        this.closeDialogStage();
      }
    },
  },
  created() {
    this.projectTeam = this.project.team;
    this.projectStages = this.project.stages;
  },
};
</script>

<style></style>
