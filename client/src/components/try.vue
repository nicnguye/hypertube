<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>

        <div v-if="!this.resetPassword" class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field type="text" name="username" v-model="username" placeholder="username" /></v-text-field>
          <br>
          <v-text-field type="password" name="password" v-model="password" placeholder="password" /></v-text-field>
          <br>
          <div class="error" v-html="error" v-if="error"/>
          <div class="success" v-html="success" v-else="success"/>
          <v-btn dark class="cyan" @click="login()">Login</v-btn>
          <v-btn dark class="cyan" @click="forgotPassword()">Forgot Password ?</v-btn>
        </div>

        <div v-if="this.resetPassword" class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field type="text" name="username" v-model="username" placeholder="user to reset the password of" /></v-text-field>
          <v-text-field type="text" name="email" v-model="email" placeholder="email to send the new password to" /></v-text-field>
          <br>
          <div class="error" v-html="error" v-if="error"/>
          <div class="success" v-html="success" v-else="success"/>
          <v-btn dark class="cyan" @click="passwordReset()">Reset Password</v-btn>
          <v-btn dark class="cyan" @click="goBackToLogin()">Go back to login</v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      error: null,
      success: null,
      resetPassword: false,
      email: '',
      username: ''
    }
  },
  methods: {
    login () {
      this.$http.post('users/login', {
        username: this.username,
        password: this.password,
      }, {emulateJSON: true}).then((res) => {
        this.success = res.body.msg;
        this.$store.commit('SET_TOKEN', res.body.token);
        this.$localStorage.set('token', res.body.token);
        this.$router.push({name: "profil"});
      }, (err) => {
        this.error = err.body;
      })
    },
    forgotPassword() {
      this.resetPassword = true;
    },
    passwordReset() {
      this.$http.post('users/resetPassword', {
        email: this.email,
        username: this.username
      }, {emulateJSON: true}).then((res) => {
        this.success = res.body;
      }, (err) => {
        this.error = err.body;
      })
    },
    goBackToLogin() {
      this.resetPassword = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
