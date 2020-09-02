<template>
  <v-menu
    v-model="menuDate"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        :value="computedDate"
        hint="DD/MM/YYYY"
        persistent-hint
        show-current="false"
        prepend-icon="mdi-calendar"
        readonly
        :required="requiredField"
        v-bind="attrs"
        v-on="on"
        :error-messages="dateErrors"
        @blur="$v.computedDate.$touch()"
      ></v-text-field>
    </template>

    <v-date-picker @input="updateValue">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="cancel">Cancel</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { formatDate } from '@/plugins/dateConverter.js';
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    date: {
      type: [String],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    requiredField: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
  },
  validations: {
    computedDate: {
      required,
    },
  },
  data() {
    return {
      menuDate: false,
    };
  },
  computed: {
    computedDate() {
      return formatDate(this.date);
    },
    dateErrors() {
      const errors = this.errorMessages;
      if (!this.requiredField || !this.$v.computedDate.$dirty) return errors;
      !this.$v.computedDate.required &&
        errors.push(`${this.label} is required`);
      return errors;
    },
  },
  methods: {
    updateValue(value) {
      this.menuDate = false;
      this.$emit('input', value);
    },
    cancel() {
      this.menuDate = false;
      this.$emit('input', this.date);
    },
    created() {
      this.$v.$reset();
    },
  },
};
</script>
