<template>
  <v-dialog v-model="dialogQuickCharge" max-width="300px">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="5">
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
        <v-text-field
          v-model="editedTSItem.hours"
          label="Number of hours"
          type="number"
          
          outlined
          :error-messages="hoursErrors"
          @blur="$v.editedTSItem.hours.$touch()"
        >
        </v-text-field>

        <v-select
          :items="projectStages"
          item-text="name"
          item-value="_id"
          v-model="editedTSItem.stage"
          label="Stage"
          dense
        >
        </v-select>

        <v-text-field
          v-model="editedTSItem.comment"
          label="Comment"
          type="text"
          dense
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { required, between, integer } from 'vuelidate/lib/validators';

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    editedTSItem: {
      type: Object,
    }
  },

  data() {
    return {
      dialogQuickCharge: true,
    };
  },

  watch: {
    dialogQuickCharge(val) {
      val || this.close();
    },
  },

  validations: {
    editedTSItem: {
      hours: {
        required,
        integer,
        between: between(1, 12),
      },
    },
  },

  computed: {
    projectStages() {
      if (this.editedItem) return this.editedItem.projectStages;
      else return [];
    },

    hoursErrors() {
      const errors = [];
      if (!this.$v.editedTSItem.hours.$dirty) return errors;
      !this.$v.editedTSItem.hours.required && errors.push('Hours is required');
      !this.$v.editedTSItem.hours.integer &&
        errors.push('Hours must be a whole number');
      !this.$v.editedTSItem.hours.between &&
        errors.push('Hours must be a positive whole number between 1-12');
      return errors;
    },
  },

  methods: {
    close() {
      this.dialogQuickCharge = false;
      this.$emit('close');
    },
    save() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.addStageNameForSelectedId();
        this.dialogQuickCharge = false;
        this.$emit('close', this.editedTSItem);
      }
    },
    addStageNameForSelectedId() {
      if (this.editedTSItem.stage) {
        const stageName = this.projectStages.find(
          (el) => String(el._id) === String(this.editedTSItem.stage)
        );
        this.editedTSItem.stageName = stageName.name;
      }
    },
  },
};
</script>
