<template>
  <div class="profil-page" v-if="user">
  		<div class="profil-picture-container">
  			<div class="profilPicture">
  				<h3>{{$t('profilPage.profilePic')}}</h3>
  				<div class="profil-image">

            <div v-if="(!user.googleId && !user.fortytwoId)" :class="{ 'selectedImage' : modifyImage === 0}" v-bind:style="{ backgroundImage: 'url(' + apiURL + user.picture + ')' }" @click="changeModifyImage(0)"  style="height: 200px; width: 160px; position:relative;"></div>
            <div v-else :class="{ 'selectedImage' : modifyImage === 0}" v-bind:style="{ backgroundImage: 'url(' + user.picture + ')' }"  style="height: 200px; width: 160px; position:relative;"></div>
          </div>
        </br>
        <input v-if="modifyImage == 0" type="file" @change="onFileSelected">
        <button class="delete-button" v-if="this.selectedFile !== null" @click="onUpload()">{{$t('profilPage.upload')}}</button>
        <button class="delete-button" v-if="modifyImage == 0" style="border: 1px solid black;" @click="deleteImage()">{{$t('profilPage.deleteImage')}}</button>
  			</div>
  		</div>

      <div class="error" v-html="error" v-if="error"/>
      <div class="success" v-html="success" v-else="success"/>

      <div v-if='!user.emailAddress' class="registerEmail">
        <div class="profil-description">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>{{$t('profilPage.registerEmailNow')}}</v-toolbar-title>
                  </v-toolbar>
                  <v-text-field type="text" v-model="email" name="registerEmail" :placeholder="$t('form.email')"></v-text-field>
                  <v-btn dark class="cyan" @click="registerEmail()">{{$t('profilPage.registerEmail')}}</v-btn>
                </v-toolbar>
                </div>
            </v-flex>
          </v-layout>
        </div>
      </br>
      </div>

      <div class="profil-big-container">
        <div class="welcome-user">
          <h1 v-if='user'>  {{$t('profilPage.welcome')}} {{user.firstName}} {{user.lastName}}</h1>
        </div>
        </br>
        <div class="profil-description">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>{{$t('profilPage.description')}}</v-toolbar-title>
                  </v-toolbar>
                  <v-text-field v-if="user.description === null" type="text" v-model="descriptionToBeAdded" name="descriptionToBeAdded" :placeholder="$t('profilPage.descriptionPlaceholder')" /></v-text-field>
                  <v-text-field v-if="changeDescription" type="text" v-model="descriptionToBeAdded" name="descriptionToBeAdded" :placeholder="$t('profilPage.descriptionPlaceholder')" /></v-text-field>
                  <v-btn v-if="user.description === null" dark class="cyan" @click="addDescription()">{{$t('profilPage.addDescription')}}</v-btn>
                  <v-btn v-if="changeDescription" dark class="cyan" @click="addDescription()">{{$t('profilPage.addDescription')}}</v-btn>
                  <h3 v-if="!changeDescription" type="text" name="description" > {{user.description}}</h3>
                  <div v-if="user.description !== null"> <v-btn v-if="!changeDescription" dark class="cyan" @click="changeDescrip()">{{$t('profilPage.modifDescription')}}</v-btn></div>
                </v-toolbar>
                </div>
            </v-flex>
          </v-layout>
        </div>
        </br>
        <div class="profil-informations">
          <div class="unfiled-informations">
            <v-layout align-center justify-center row fill-height>
              <v-flex align-self-center xs10>
                <div class="white elevation-2">
                  <v-toolbar flat dense class="cyan" dark>
                    <v-toolbar-title>{{$t('profilPage.changeUserInfos')}}</v-toolbar-title>
                  </v-toolbar>
                  <v-btn dark class="cyan" v-if="!user.fortytwoId && !user.googleId" @click="navigateTo({name: 'changePassword'})">{{$t('profilPage.changePassword')}}</v-btn>
                  <v-btn dark class="cyan" @click="navigateTo({name: 'changeUserInfos'})">{{$t('profilPage.modifyUserInfos')}}</v-btn>
                </div>
              </v-flex>
            </v-layout>
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
      user: false,
      descriptionToBeAdded: null,
      selectedFile: null,
      apiURL: this.$http.options.root,
      modifyImage: -1,
      tag: '',
      changeDescription: false,
      changeInformations: false,
      email: '',
      success: '',
      error: ''
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
  registerEmail() {
    this.$http.post('register/registerEmail', {
      email: this.email,
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      if (res.status == 203) {
      this.error = res.body
      this.success = ''
    } else {
      this.error = ''
      this.$router.go('/profil');
    }
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
  changeDescrip() {
    this.changeDescription = true;
  },
  addDescription() {
    this.$http.post('addDescription', {
      descriptionToBeAdded : this.descriptionToBeAdded,
      token: this.token
    }, {emulateJSON: true}).then((res) => {
      this.getUser();
      this.changeDescription = false;
    }, (err) => {
      console.log(err);
    })
  },

  onFileSelected(event) {
    this.selectedFile = event.target.files[0]
  },
  onUpload() {
    let formData = new FormData()
    formData.append('myFile', this.selectedFile)
    formData.append('token', this.token)
    formData.append('number', this.modifyImage)
    this.$http.post('updateUser/uploadPicture', formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
      this.getUser();
    }, (err) => {
      console.log(err)
    })
  },
  changeModifyImage(imageIdNumber) {
    if (this.modifyImage === imageIdNumber)
      this.modifyImage = -1;
    else
      this.modifyImage = imageIdNumber;
  },
  deleteImage() {
    this.$http.post('updateUser/deletePicture', {
      token: this.token,
    }, {emulateJSON: true}).then((res) => {
      this.getUser();
    }, (err) => {
      this.error = err.body;
    })
  },
  navigateTo (route) {
    this.$router.push(route)
  }
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

.error {
  color: red;
}
.success {
  color: green;
}
</style>
