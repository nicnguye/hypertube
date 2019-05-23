<template lang="html">
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>{{$t('modifyUserInfos.changeFirstname')}}</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newFirstName" v-model="newFirstName" :placeholder="$t('modifyUserInfos.newFirstName')" /></v-text-field>
            <br>
            <div class="error" v-html="errorFirstName" v-if="!successFirstName" />
            <div class="success" v-html="successFirstName" v-else-if="successFirstName" />
            <v-btn dark class="cyan" @click="changeFirstName()">{{$t('modifyUserInfos.changeFirstname2')}}</v-btn>
          </div>
      </div>
      <br>

      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>{{$t('modifyUserInfos.changeLastname')}}</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newLastName" v-model="newLastName" :placeholder="$t('modifyUserInfos.newLastName')" /></v-text-field>
            <br>
            <div class="error" v-html="errorLastName" v-if="!successLastName" />
            <div class="success" v-html="successLastName" v-else-if="successLastName" />
            <v-btn dark class="cyan" @click="changeLastName()">{{$t('modifyUserInfos.changeLastname2')}}</v-btn>
          </div>
      </div>
      <br>

      <div v-if='user.emailAddress' class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>{{$t('modifyUserInfos.changeEmail')}}</v-toolbar-title>
          </v-toolbar>
          <div class="pl-4 pr-4 pt-2 pb-2">
            <v-text-field type="text" name="newEmail" v-model="newEmail" :placeholder="$t('modifyUserInfos.newEmail')" /></v-text-field>
            <br>
            <div class="error" v-html="errorEmail" v-if="!successEmail" />
            <div class="success" v-html="successEmail" v-else-if="successEmail" />
            <v-btn dark class="cyan" @click="changeEmail()">{{$t('modifyUserInfos.changeEmail2')}}</v-btn>
          </div>
      </div>
      <div v-else-if='!user.emailAddress'>
        <h3>{{$t('modifyUserInfos.emailMessage')}}</h3>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      token: this.checkToken(),
      user: false,
      newLastName: null,
      newFirstName: null,
      newEmail: null,
      successLastName: null,
      errorLastName: null,
      successFirstName: null,
      errorFirstName: null,
      successEmail: null,
      errorEmail: null
    }
  },
  mounted () {
  this.getUser();
},
  methods: {
    getUser() {
      this.$http.post('getUser', {
        token: this.token
      }, {emulateJSON: true}).then((res) => {
        this.user = res.body;
      }, (err) => {
        console.log(err);
      })
    },
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
    changeLastName() {
      this.$http.post('users/changeLastName', {
        token: this.token,
        newLastName: this.newLastName
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorLastName = res.body,
          this.successLastName = null
        } else {
          this.successLastName = res.body,
          this.error = null
        }
      }, (err) => {
        this.errorLastName = err.body
      })
    },
    changeFirstName() {
      this.$http.post('users/changeFirstName', {
        token: this.token,
        newFirstName: this.newFirstName
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorFirstName = res.body,
          this.successFirstName = null
        } else {
          this.successFirstName = res.body,
          this.errorFirstName = null
        }
      }, (err) => {
        this.errorFirstName = err.body
        this.successFirstName = null
      })
    },
    changeEmail() {
      this.$http.post('users/changeEmail', {
        token: this.token,
        newEmail: this.newEmail
      }, {emulateJSON: true}).then((res) => {
        if (res.status == 203) {
          this.errorEmail = res.body,
          this.successEmail = null
        } else {
          this.successEmail = res.body,
          this.errorEmail = null
        }
      }, (err) => {
        this.errorEmail = err,
        this.successEmail = null
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
