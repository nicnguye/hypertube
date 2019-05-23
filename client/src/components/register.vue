<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>

        <div class="pl-4 pr-4 pt-2 pb-2">
          <form name="register-form" autocomplete="off">
            <v-text-field type="text" name="emailAddress" v-model="emailAddress" :placeholder="$t('form.email')" /></v-text-field>
            <br>
            <v-text-field type="text" name="username" v-model="username" :placeholder="$t('form.username')" /></v-text-field>
            <br>
            <v-text-field type="text" name="lastName" v-model="lastName" :placeholder="$t('form.lastName')" /></v-text-field>
            <br>
            <v-text-field type="text" name="firstName" v-model="firstName" :placeholder="$t('form.firstName')" /></v-text-field>
            <br>
            <v-text-field type="password" name="password" v-model="password" :placeholder="$t('form.password')" /></v-text-field>
            <br>
            <v-text-field type="password" name="passwordConfirmation" v-model="passwordConfirmation" :placeholder="$t('form.confirmPassword')" />
            <br>
            <div class="error" v-html="error" v-if="!success" />
            <div class="success" v-html="success" v-else-if="success" />
          </form>
        </div>
        <v-btn dark class="cyan" @click="register()">{{$t('form.register')}}</v-btn>
        <v-btn dark class="cyan" @click="googleAuth()">{{$t('form.registerGoogle')}}</v-btn>
        <v-btn dark class="cyan" @click="passport42()">{{$t('form.register42')}}</v-btn>
        </div>
    </v-flex>
  </v-layout>
</template>


<script>
export default {
  data () {
    return {
      emailAddress: '',
      username: '',
      lastName: '',
      firstName: '',
      password: '',
      passwordConfirmation: '',
      error: null,
      success: null
    }
  },
  methods: {
    register () {
      this.$http.post('register', {
        emailAddress: this.emailAddress,
        username:this.username,
        lastName: this.lastName,
        firstName: this.firstName,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
      }, {emulateJSON: true}).then((response) => {
        if (response.status == 203) {
          this.error = response.body
          this.success = null
        } else {
          this.error = null
          this.success = response.body;
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
        }
      }, (err) => {
        this.error = err.body;
      })
    },
    googleAuth() {
      window.location.href = 'http://localhost:8081/users/google';
    },
    passport42() {
      window.location.href = 'http://localhost:8081/users/42';
    }
  }
}
</script>
<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
