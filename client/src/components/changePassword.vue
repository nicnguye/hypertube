<template lang="html">
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>{{$t('profilPage.changePassword')}}</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="password" name="oldPassword" v-model="oldPassword" :placeholder="$t('changePassword.oldPassword')" /></v-text-field>
            <br>
            <v-text-field type="password" name="newPassword" v-model="newPassword" :placeholder="$t('changePassword.newPassword')" /></v-text-field>
            <br>
            <v-text-field type="password" name="newPasswordConfirmation" v-model="newPasswordConfirmation" :placeholder="$t('changePassword.newPasswordConfirm')" /></v-text-field>
            <br>
            <div class="error" v-html="error" v-if="!success" />
            <div class="success" v-html="success" v-else-if="success" />
            <v-btn dark class="cyan" @click="changePassword()">{{$t('changePassword.resetPassword')}}</v-btn>
          </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      token: this.checkToken(),
      oldPassword: null,
      newPassword: null,
      newPasswordConfirmation: null,
      success: null,
      error: null
    }
  },
  methods: {
    checkToken () {
      let token = this.$localStorage.get('token')
      if (token) {
        this.$store.commit('SET_TOKEN', token)
        return(token)
        //this.$router.push('profil')
      }
      else {
        this.$store.commit('SET_TOKEN', null)
        this.$router.push('login')
      }
    },
    changePassword() {
      this.success = null;
      this.error = null;
      this.$http.post('users/changePassword', {
        token: this.token,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPasswordConfirmation: this.newPasswordConfirmation
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.success = null
          this.error = res.body
        } else {
          this.success = res.body,
          this.error = null
        }
      }, (err) => {
        this.success = null;
        this.error = err.body
      })
    }
  }
}
</script>

<style lang="css">
.error {
  color: red;
}
.success {
  color: green;
}
</style>
