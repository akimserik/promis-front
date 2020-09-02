<template>
  <v-card>
    <v-container fluid>
      <v-row class="child-flex">
        <v-toolbar>
          <v-btn icon class="hidden-xs-only" @click="cancel">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <v-toolbar-title>{{
            this.currentEmployee.name || 'New employee'
          }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn small outlined color="success" dark class="mr-2">
            <v-icon left>mdi-pencil</v-icon> Edit</v-btn
          >
        </v-toolbar>
      </v-row>

      <v-form @submit.prevent="save">
        <v-card class="mt-3">
          <v-card-title>Main</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="currentEmployee.firstName"
                  label="First name"
                  :error-messages="firstNameErrors"
                  @blur="$v.currentEmployee.firstName.$touch()"
                  @input="inputFirstLastName"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="currentEmployee.lastName"
                  label="Last name"
                  :error-messages="lastNameErrors"
                  @blur="$v.currentEmployee.lastName.$touch()"
                  @input="inputFirstLastName"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="currentEmployee.name"
                  label="Full Name"
                  :error-messages="nameErrors"
                  @blur="$v.currentEmployee.name.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-3">
          <v-card-title>Job details</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="departments"
                  v-model="currentEmployee.department"
                  item-text="department"
                  item-value="_id"
                  label="Department"
                  :error-messages="departmentErrors"
                  @blur="$v.currentEmployee.department.$touch()"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="positions"
                  v-model="currentEmployee.position"
                  item-text="position"
                  item-value="_id"
                  label="Position"
                  :error-messages="positionErrors"
                  @blur="$v.currentEmployee.position.$touch()"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="offices"
                  v-model="currentEmployee.office"
                  item-text="office"
                  item-value="_id"
                  label="Office"
                  :error-messages="officeErrors"
                  @blur="$v.currentEmployee.office.$touch()"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <BaseDatePicker
                  :label="'Hired date'"
                  :date="currentEmployee.hiredDate"
                  v-model="currentEmployee.hiredDate"
                  v-on:input="inputHiredDate"
                  required
                  :error-messages="hiredDateErrors"
                  @blur="$v.currentEmployee.hiredDate.$touch()"
                ></BaseDatePicker>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-3">
          <v-card-title>User Account</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="currentEmployee.email"
                  label="Email"
                  :error-messages="emailErrors"
                  @blur="$v.currentEmployee.email.$touch()"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="roles"
                  v-model="currentEmployee.role"
                  item-text="role"
                  item-value="_id"
                  label="System role"
                  :error-messages="roleErrors"
                  @blur="$v.currentEmployee.role.$touch()"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="isNewItemCreation">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  name="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :error-messages="passwordErrors"
                  @blur="$v.password.$touch()"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  v-model="passwordConfirm"
                  name="passwordConfirm"
                  label="Confirm password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :error-messages="passwordConfirmErrors"
                  @blur="$v.passwordConfirm.$touch()"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-switch
                  v-model="currentEmployee.active"
                  :label="`Login allowed: ${this.labelLoginAllowed}`"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { formatDate } from '@/plugins/dateConverter.js';
import {
  required,
  requiredIf,
  email,
  maxLength,
  minLength,
  sameAs,
} from 'vuelidate/lib/validators';
import { positions, offices, departments, roles } from '@/data/catalogs.js';

export default {
  name: 'EmployeeCardPage',
  data() {
    return {
      menuHiredDate: false,
      defaultEmployee: {},
      showPassword: false,
      password: '',
      passwordConfirm: '',
    };
  },

  props: {
    mode: {
      type: String,
      default: 'Edit',
    },
  },

  validations: {
    currentEmployee: {
      firstName: {
        required,
        maxLength: maxLength(20),
        minLength: minLength(2),
      },
      lastName: {
        required,
        maxLength: maxLength(30),
        minLength: minLength(2),
      },
      name: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(5),
      },
      email: {
        required,
        email,
      },
      department: {
        required,
      },
      position: {
        required,
      },
      office: {
        required,
      },
      role: {
        required,
      },
      hiredDate: {
        required,
      },
    },
    password: {
      required: requiredIf(function () {
        return this.mode == 'CreateNew';
      }),
      minLength: minLength(8),
    },
    passwordConfirm: {
      required: requiredIf(function () {
        return this.mode == 'CreateNew';
      }),
      sameAsPassword: sameAs('password'),
    },
  },

  computed: {
    ...mapState(['projects', 'authUser', 'employees']),
    currentEmployee() {
      if (this.mode == 'CreateNew') {
        return this.defaultEmployee;
      } else return this.employees.employee.data;
    },
    computedHiredDate() {
      return formatDate(this.currentEmployee.hiredDate);
    },
    computedFullName() {
      return `${this.currentEmployee.firstName || ''} ${
        this.currentEmployee.lastName || ''
      }`;
    },

    // VALIDATION HANDLERS
    hiredDateErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.hiredDate.$dirty) return errors;
      !this.$v.currentEmployee.hiredDate.required &&
        errors.push('Hired date is required');
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.firstName.$dirty) return errors;
      !this.$v.currentEmployee.firstName.required &&
        errors.push('First name is required');
      !this.$v.currentEmployee.firstName.minLength &&
        errors.push('First name must be minimum 2 characters');
      !this.$v.currentEmployee.firstName.maxLength &&
        errors.push('First name must be maximum 20 characters');
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.lastName.$dirty) return errors;
      !this.$v.currentEmployee.lastName.required &&
        errors.push('Last name is required');
      !this.$v.currentEmployee.lastName.minLength &&
        errors.push('Last name must be minimum 2 characters');
      !this.$v.currentEmployee.lastName.maxLength &&
        errors.push('Last name must be maximum 30 characters');
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.name.$dirty) return errors;
      !this.$v.currentEmployee.name.required && errors.push('Name is required');
      !this.$v.currentEmployee.name.minLength &&
        errors.push('Name must be minimum 5 characters');
      !this.$v.currentEmployee.name.maxLength &&
        errors.push('Name must be maximum 50 characters');
      return errors;
    },
    departmentErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.department.$dirty) return errors;
      !this.$v.currentEmployee.department.required &&
        errors.push('Department is required');
      return errors;
    },
    positionErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.position.$dirty) return errors;
      !this.$v.currentEmployee.position.required &&
        errors.push('Position is required');
      return errors;
    },
    officeErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.office.$dirty) return errors;
      !this.$v.currentEmployee.office.required &&
        errors.push('Office is required');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.email.$dirty) return errors;
      !this.$v.currentEmployee.email.email &&
        errors.push('Must be valid e-mail');
      !this.$v.currentEmployee.email.required &&
        errors.push('Email is required');
      return errors;
    },
    roleErrors() {
      const errors = [];
      if (!this.$v.currentEmployee.role.$dirty) return errors;
      !this.$v.currentEmployee.role.required &&
        errors.push('System role is required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      !this.$v.password.minLength &&
        errors.push('Password must be minimum 8 characters');
      return errors;
    },
    passwordConfirmErrors() {
      const errors = [];
      if (!this.$v.passwordConfirm.$dirty) return errors;
      !this.$v.passwordConfirm.required &&
        errors.push('Password confirmation is required');
      !this.$v.passwordConfirm.sameAsPassword &&
        errors.push('Password and confirmation do not match');

      return errors;
    },

    // OTHER PROPERTIES
    labelLoginAllowed() {
      if (this.currentEmployee.active) {
        return 'YES';
      } else return 'NO';
    },
    isAdmin() {
      return this.authUser.user.data.user.role == 'admin';
    },
    isNewItemCreation() {
      return this.mode == 'CreateNew';
    },
    positions() {
      return positions;
    },
    offices() {
      return offices;
    },
    departments() {
      return departments;
    },
    roles() {
      if (!this.isAdmin && roles.indexOf('admin') > 0) {
        roles.splice(roles.indexOf('admin'), 1);
      }
      return roles;
    },
  },

  methods: {
    save() {
      this.$v.$touch();
      this.$vuetify.goTo(0);
      if (!this.$v.$invalid) {
        if (this.mode == 'Edit') {
          this.$store
            .dispatch('employees/updateEmployee', this.currentEmployee)
            .then(() => {
              this.cancel();
            });
        } else if (this.mode == 'CreateNew') {
          this.currentEmployee.password = this.password;
          this.currentEmployee.passwordConfirm = this.passwordConfirm;
          this.$store
            .dispatch('employees/createEmployee', this.currentEmployee)
            .then(() => {
              this.cancel();
            });
        }
      }
    },
    cancel() {
      this.$store.dispatch('employees/clearCurrentEmployee');
      this.$v.$reset();
      this.$router.push({ name: 'Employees' });
    },
    inputHiredDate() {
      this.$v.currentEmployee.hiredDate.$touch();
    },
    inputFirstLastName() {
      this.currentEmployee.name = this.computedFullName;
    },
  },
};
</script>
