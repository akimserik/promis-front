<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="projectsArray"
      class="elevation-1"
      :search="search"
      :loading="!tableLoaded"
      loading-text="Loading... Please wait"
      show-group-by
      @dblclick:row="doubleClick"
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
          <ProjectMainDialog
            v-if="dialog"
            :editedItem="editedItem"
            :editedIndex="editedIndex"
            :employees="employees"
            :inCharges="inCharges"
            @closeMainDialog="close"
          />
          <ProjectManagerEditionDialog
            v-if="dialogManager"
            :project="editedItem"
            :inCharges="inCharges"
            @closeDialogManager="dialogManager = false"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil </v-icon>
        <v-icon small class="mr-2" @click="openManagerDialog(item)"
          >mdi-shield-edit
        </v-icon>
        <!-- <v-icon v-if="isAdmin" small @click="deleteItem(item)"
          >mdi-delete
        </v-icon> -->
      </template>

      <template v-slot:item.feeKZT="{ item }">
        {{ item.feeKZT | amount }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ProjectMainDialog from '@/views/ProjectMainDialog.vue';
import ProjectManagerEditionDialog from '@/views/ProjectManagerEditionDialog.vue';

export default {
  name: 'ProjectsPage',
  components: { ProjectMainDialog, ProjectManagerEditionDialog },
  data() {
    return {
      dialog: false,
      dialogManager: false,
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
    };
  },

  mounted() {
    this.$store.dispatch('projects/fetchProjects', this.userToken);
    this.$store.dispatch('employees/fetchEmployees', this.userToken);
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogManager(val) {
      val || this.close();
    },
  },

  computed: {
    ...mapState(['projects', 'authUser', 'employees']),

    tableLoaded() {
      return this.projectsArray.length > 0;
    },

    projectsArray() {
      return this.projects.projects.data.data;
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
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.projectsArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    openManagerDialog(item) {
      this.editedIndex = this.projectsArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogManager = true;
    },

    deleteItem(item) {
      const index = this.projectsArray.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.projectsArray.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    doubleClick: function (event, row) {
      this.editItem(row.item);
    },
  },
};
</script>
