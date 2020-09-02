<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card>
      <v-card-title>
        <span class="subtitle">Select New Project for Timesheet</span>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn color="primary" text @click="close">
            Close
          </v-btn>
          <v-btn color="primary" text @click="add">
            Add selected
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          class="elevation-1"
          dense
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

          <template v-slot:body="{ items }">
            <tbody>
              <tr
                :class="
                  key === selectedRow
                    ? 'custom-highlight-row'
                    : 'custom-ordinary-row'
                "
                @click="onRowClick(key)"
                @dblclick="add"
                v-for="(item, key) in items"
                :key="item.engagementCode"
              >
                <td>{{ item.engagementCode }}</td>
                <td>{{ item.clientName }}</td>
                <td>{{ item.contractSubject }}</td>
                <td>{{ item.serviceLine }}</td>
                <td>{{ item.partner.name }}</td>
                <td>{{ item.manager.name }}</td>
              </tr>
            </tbody>
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
  name: 'ProjectSelectionDialog',
  props: {
    currentEmployee: {
      required: true,
    },
    usedProjects: {
      type: Array,
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  data() {
    return {
      dialog: true,
      search: '',
      selectedRow: null,
      headers: [
        { text: 'Engagement code', value: 'engagementCode' },
        { text: 'Client name', value: 'clientName' },
        { text: 'Contract subject', value: 'contractSubject' },
        { text: 'Service line', value: 'serviceLine' },
        { text: 'Partner', value: 'partner.name' },
        { text: 'Manager', value: 'manager.name' },
      ],
      items: [],
    };
  },
  computed: {
    ...mapState(['projects']),
  },
  methods: {
    close() {
      this.dialog = false;
      this.$emit('closeDialogAddNewProject');
    },
    add() {
      this.dialog = false;
      this.$emit('closeDialogAddNewProject', this.items[this.selectedRow]);
    },
    onRowClick(rowId) {
      this.selectedRow = rowId;
    },
    setItems() {
      this.usedProjects.forEach((element) => {
        let elToRemove = this.items.find((item) => item._id == element);
        this.items.splice(this.items.indexOf(elToRemove), 1);
      });
    },
  },
  mounted() {
    if (
      this.currentEmployee.role == 'manager' ||
      this.currentEmployee.role == 'staff'
    ) {
      this.$store.dispatch('projects/fetchMyProjects').then(() => {
        this.items = this.projects.myProjects.data;
        this.setItems();
      });
    } else {
      this.$store.dispatch('projects/fetchProjects').then(() => {
        this.items = this.projects.projects.data.data;
        this.setItems();
      });
    }
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
