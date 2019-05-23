<template>
  <v-toolbar dense fixed class="black" dark>
      <div class="title-navbar">
        <v-btn class='home'  v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'homepage'})">
          Hypertube
        </v-btn>
        <v-btn class='home' v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'profil'})">
          Hypertube
        </v-btn>

      </div>

      <v-spacer></v-spacer>

      
      <div class="navbar-items">
        <button class="navbar-button" v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'login'})">{{$t('header.login')}}</button>
        <button class="navbar-button" v-if="!$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'register'})">{{$t('header.register')}}</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'users'})">{{$t('header.showUsers')}}</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="navigateTo({name: 'movies'})">{{$t('header.movies')}}</button>
        <button class="navbar-button" v-if="$store.state.isUserLoggedIn" flat dark @click="logout()">{{$t('header.logout')}}</button>
      </div>
      
  </v-toolbar>
</template>

<script>
export default {
  data () {
    return {
      token: this.checkToken(),
      // notifications: null,
      // showNotif: false,
      // unreadNotification: false
    }
  },
  // mounted () {
  //   setInterval(function(){ this.checkDeleteMovie(); }.bind(this), 5000000)
  // },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.token = null;
      this.$localStorage.remove('token')
      this.$store.commit('SET_TOKEN', null)
      this.$router.push({name: "login"})
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
        if (this.$route.name !== 'confirmation' && this.$route.name !== 'connect')
          this.$router.push('/')
      }
    },
    // checkDeleteMovie() {
    //    this.$http.post('movie/checkDeleteDate', {
    //      token: this.token
    //    }, {emulateJSON: true}).then((res) => {
    //        console.log(res);
    //      }, (err) => {
    //        console.log(err);
    //      })
    //    }
  //   getNotification() {
  //     if (!this.token)
  //       return;
  //     this.$http.post('notification/checkNotifications', {
  //       token: this.token
  //     }, {emulateJSON: true}).then((res) => {
  //       this.notifications = res.body
  //       if (this.notifications.length > 0)
  //         this.unreadNotification = true
  //       else {
  //         this.unreadNotification = false
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     })
  //   },
  //   readNotification(notif) {
  //     this.$http.post('notification/readNotification', {
  //       token: this.token,
  //       notification: notif._id
  //     }, {emulateJSON: true}).then((res) => {
  //
  //     }, (err) => {
  //       console.log(err);
  //     })
  //   }
  }
}
</script>

<style scoped>
.home {
  cursor: pointer;
}

.home:hover {
  color: #E9E;
}
</style>
