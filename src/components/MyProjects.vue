<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    item-key="engagementCode"
    group-by="me"
    hide-default-footer
    @dblclick:row="onRowDoubleClick"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My Projects</v-toolbar-title>

        <ProjectManagerEditionDialog
          v-if="dialogManager"
          :project="editedItem"
          :inCharges="inCharges"
          @closeDialogManager="closeDialogManager"
        />
      </v-toolbar>
    </template>

    <template v-slot:group.header="{ items, isOpen, toggle }">
      <th colspan="10">
        <v-icon @click="toggle"
          >{{ isOpen ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline' }}
        </v-icon>
        Me: {{ items[0].me }}
      </th>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        v-if="item.me == 'manager'"
        @click="openManagerDialog(item)"
        >mdi-pencil</v-icon
      >
    </template>

    <!-- to add context menu and customized grouping header -->
    <!-- https://codepen.io/chansv/pen/wvvzXRj?editors=1010 -->
    <!-- https://codepen.io/majesticpotatoe-the-bashful/pen/MWWWWjR -->
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex';
import { dateToLocalFormat } from '@/plugins/dateConverter.js';
import ProjectManagerEditionDialog from '@/components/ProjectManagerEditionDialog.vue';
export default {
  name: 'MyProjects',
  components: {
    ProjectManagerEditionDialog,
  },
  props: {
    currentUser: {
      required: true,
    },
  },
  data() {
    return {
      selectedRow: null,
      headers: [
        { text: 'Engagement code', value: 'engagementCode' },
        { text: 'Client name', value: 'clientName' },
        { text: 'Contract subject', value: 'contractSubject' },
        { text: 'Partner', value: 'partner.name' },
        { text: 'Manager', value: 'manager.name' },
        { text: 'In charge', value: 'inCharge.name' },
        { text: 'Location', value: 'location' },
        { text: 'Completion', value: 'completion' },
        {
          text: 'Expected report date',
          value: 'expectedDateOfReportLocal',
          width: '50px',
        },
        { text: 'Me', value: 'me' },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          groupable: false,
        },
      ],
      items: [],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      dialogManager: false,
    };
  },

  watch: {
    dialogManager(val) {
      val || this.closeDialogManager();
    },
  },

  computed: {
    ...mapState(['projects', 'employees']),
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
  mounted() {
    this.prepareItems();
  },
  methods: {
    prepareItems() {
      this.$store.dispatch('projects/fetchMyProjects').then(() => {
        this.items = this.projects.myProjects.data;
        if (this.items.length) {
          this.items.map((item) => {
            item.expectedDateOfReportLocal = dateToLocalFormat(
              item.expectedDateOfReport
            );
            if (String(item.partner._id) == String(this.currentUser._id)) {
              item.me = 'partner';
            } else if (
              String(item.manager._id) == String(this.currentUser._id)
            ) {
              item.me = 'manager';
            } else if (
              String(item.inCharge._id) == String(this.currentUser._id)
            ) {
              item.me = 'in charge';
            } else item.me = 'team member';
          });
        }
      });
    },

    onRowDoubleClick: function (event, row) {
      this.openManagerDialog(row.item);
    },
    openManagerDialog(item) {
      if (!(item.me == 'manager')) return;

      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogManager = true;
    },
    closeDialogManager() {
      this.dialogManager = false;
      this.prepareItems();
    },
  },
};
</script>
