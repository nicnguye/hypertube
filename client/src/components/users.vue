<template lang="html">
<div>
  <div v-if="this.users && this.users.length > 0" class="message-search-page">
    {{$t('showUsers.message')}}
  </div>

  <div v-if="this.showError == true">
    {{this.error}}
  </div>
  <br>

  <div class="suggestions-big-box" v-if="user && user.picture !== 'images/default.jpg'">
        <div v-if="users">
          <div v-if="users.length === 0">
            {{$t('showUsers.messageErr')}}
          </div>
        </div>
        <div v-for="user in users" class="suggestions-profil">
          <div v-if="(!user.googleId && !user.fortytwoId)" class="suggestions-profil-picture" @click="showUser(user);" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture + ')' }" ></div>
          <div v-else class="suggestions-profil-picture" @click="showUser(user);" v-bind:style="{ backgroundImage: 'url(' + user.picture + ')' }"></div>
          <h3>{{user.firstName}} {{user.lastName}}</h3>
        </div>
  </div>

  <div class="show-user-details" v-if="popup">
    <div class="show-user-details-profil2">
      <img class="show-user-close-button" @click="closeProfil()" src="../assets/cancel.svg">
      <div class="show-user-global">

      <div v-if="(!this.userToShow.googleId && !this.userToShow.fortytwoId)" class="show-user-picture"  v-bind:style="{ backgroundImage: 'url(' + apiURL + this.userToShow.picture + ')' }" ></div>
      <div v-else class="show-user-picture" v-bind:style="{ backgroundImage: 'url(' + this.userToShow.picture + ')' }"></div>
      <div class="show-user-infos">
        <div class="show-user-infos-names">
          {{this.userToShow.firstName}}  {{this.userToShow.lastName}} </br></br>
            {{$t('form.username')}}: {{this.userToShow.username}} </br></br>
        </div>
        <div class="show-user-infos-description">
          Description: {{this.userToShow.description}} <br/>
        </div>
      </div>
    </div>
    </div>
  </div>

</div>
</template>

<script>


export default {
  data () {
    return {
      token: this.checkToken(),
      user: null,
      userToShow: [],
      apiURL: this.$http.options.root,
      error: null,
      popup: false,
      users: null,
      showError: false
    }
  },
  mounted () {
  this.getUser();
  this.getOtherUsers();
},
methods: {
  getUser() {
    this.$http.post('getUser', {
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      this.user = res.body
    }, (err) => {
      this.error = err
      this.showError = true
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
    getOtherUsers() {
      this.$http.post('getOtherUsers', {
        token: this.token
      }, {emulateJSON: true}).then((res) => {
        this.users = res.body
      }, (err) => {
        this.error = err
        this.showError = true
      })
    },
    showUser(user) {
      this.userToShow = user
      this.popup = true
    },
    navigateTo (route) {
      this.$router.push(route)
    },
    closeProfil() {
      this.popup = false;
    },
  }
}
</script>

<style lang="css">
.selectedImage {
  border: 1px solid red;
}
.map_profile {
  margin: 0 auto;
	height: 298px;
	width: 298px;
	text-align: initial;
	border: 1px solid black;
}
</style>
