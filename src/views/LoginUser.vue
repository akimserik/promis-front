<template>
  <div>
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="4">
          <v-img :src="require('@/assets/logo.svg')" class="my-3" contain height="50"></v-img>
          <v-card width="400" class="mx-auto mt-5">
            <v-card-title class="pb-0">
              <h3>Login</h3>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field
                  label="E-mail"
                  prepend-icon="mdi-account-circle"
                  v-model="email"
                  type="email"
                  name="email"
                  required
                  :error-messages="emailErrors"
                  @blur="$v.email.$touch()"
                />
                <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  name="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  required
                  :error-messages="passwordErrors"
                  @blur="$v.password.$touch()"
                />
                <p class="red--text">{{ error }}</p>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn type="submit" name="button" color="indigo" dark>Login</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { mapState } from "vuex";

export default {
  name: 'Login',

  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
      error: null,
    };
  },

  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },

  computed: {
    ...mapState(["authUser", "authUser"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid e-mail');
      !this.$v.email.required && errors.push('E-mail is required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Password is required');
      return errors;
    },
  },

  methods: {
    login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$store
          .dispatch('authUser/login', {
            email: this.email,
            password: this.password,
          })
          .then(() => {
            this.$router.push({ name: 'Dashboard' });
          })
          .catch((err) => {
            this.error = err.response.data.message;
          });
      }
    },
  },
  created() {
    if (this.authUser.loggedIn) this.$router.push({ name: 'Dashboard' });
  },
};
</script>
