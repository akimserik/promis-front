<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="employeesArray"
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
          <v-btn
            small
            outlined
            color="primary"
            dark
            class="mr-2"
            @click="createNew"
          >
            <v-icon left>mdi-plus-circle-outline</v-icon> Add new</v-btn
          >
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      </template>

      <template v-slot:item.hiredDate="{ item }">
        {{ item.hiredDate | shortDate }}
      </template>

      <template v-slot:item.active="{ item }">
        <v-simple-checkbox v-model="item.active" disabled></v-simple-checkbox>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@/plugins/dateConverter.js';

export default {
  name: 'EmployeeListPage',
  components: {},
  data() {
    return {
      search: '',
      headers: [
        { text: 'Name', value: 'name', groupable: false },
        { text: 'Position', value: 'position', groupable: false },
        { text: 'Department', value: 'department' },
        { text: 'Office', value: 'office', groupable: false },
        { text: 'Hired date', value: 'hiredDate', groupable: false },
        { text: 'Role', value: 'role', groupable: false },
        // { text: 'Active', value: 'active', groupable: false },
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

  filters: {
    shortDate(date) {
      return formatDate(date);
    },
  },

  created() {
    this.$store.dispatch('projects/fetchProjects', this.userToken);
    this.$store.dispatch('employees/fetchEmployees', this.userToken);
  },

  computed: {
    ...mapState(['projects', 'authUser', 'employees']),

    tableLoaded() {
      return this.employeesArray.length > 0;
    },

    employeesArray() {
      return this.employees.employees.data.data;
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
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.employeesArray.indexOf(item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem) {
        this.$router.push({
          name: 'EmployeeEdit',
          params: { id: this.editedItem._id },
        });
      }
    },
    createNew() {
      this.$router.push({
        name: 'EmployeeCreate',
      });
    },
    doubleClick: function (event, row) {
      this.editItem(row.item);
    },
    addNew() {},
  },
};
</script>
