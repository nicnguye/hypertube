<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>

        <div v-if="!this.resetPassword" class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field type="text" name="username" v-model="username" :placeholder="$t('form.username')" /></v-text-field>
          <br>
          <v-text-field type="password" name="password" v-model="password" :placeholder="$t('form.password')" /></v-text-field>
          <br>
          <div class="error" v-html="error" v-if="error"/>
          <div class="success" v-html="success" v-else="success"/>
          <v-btn dark class="cyan" @click="login()">{{$t('form.login')}}</v-btn>
          <v-btn dark class="cyan" @click="forgotPassword()">{{$t('form.forgetPassword')}}</v-btn>
          <v-btn dark class="cyan" @click="googleAuth()">{{$t('form.connectGoogle')}}</v-btn>
          <v-btn dark class="cyan" @click="passport42()">{{$t('form.connect42')}}</v-btn>

        </div>

        <div v-if="this.resetPassword" class="pl-4 pr-4 pt-2 pb-2">
          <v-text-field type="text" name="username" v-model="username" :placeholder="$t('form.userResetPassword')" /></v-text-field>
          <v-text-field type="text" name="email" v-model="email" :placeholder="$t('form.emailSendNewPassword')" /></v-text-field>
          <br>
          <div class="error" v-html="error" v-if="error"/>
          <div class="success" v-html="success" v-else="success"/>
          <v-btn dark class="cyan" @click="passwordReset()">{{$t('form.resetPassword')}}</v-btn>
          <v-btn dark class="cyan" @click="goBackToLogin()">{{$t('form.goBackLogin')}}</v-btn>
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
        if (res.status == 203) {
          this.error = res.body
        } else {
        this.success = res.body.msg;
        this.$store.commit('SET_TOKEN', res.body.token);
        this.$localStorage.set('token', res.body.token);
        this.$router.push({name: "profil"});
      }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
