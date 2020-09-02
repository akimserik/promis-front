<template>
  <v-dialog v-model="dialog" max-width="550px">
    <v-card>
      <v-card-title>
        <span class="subtitle">Select Employees</span>
      </v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selected"
          :headers="headersTeam"
          :items="employeesArray"
          :search="search"
          item-key="name"
          class="elevation-1"
          dense
          height="255"
          hide-default-footer
          show-select
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
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">
          Close
        </v-btn>
        <v-btn color="primary" text @click="add">
          Add selected
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {},
  data() {
    return {
      dialog: true,
      search: '',
      selected: [],
      headersTeam: [
        { text: 'Employee', value: 'name' },
        { text: 'Position', value: 'position' },
        { text: 'Department', value: 'department' },
      ],
    };
  },
  computed: {
    ...mapState(['employees']),
    employeesArray() {
      return this.employees.employees.data.data;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('closeDialogTeam');
    },
    add() {
      this.dialog = false;
      this.$emit('closeDialogTeam', this.selected);
    },
  },
};
</script>
