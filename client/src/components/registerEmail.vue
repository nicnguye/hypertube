<template>
  <v-layout align-center justify-center row fill-height>
    <v-flex align-self-center xs10>
      <br/>  {{$t('profilPage.needEmailMessage')}} <br/><br/><br/>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>RegisterEmail</v-toolbar-title>
        </v-toolbar>

        <v-text-field type="text" name="emailAddress" v-model="emailAddress" :placeholder="$t('form.email')" /></v-text-field>
        <v-btn dark class="cyan" @click="registerEmailAddress()">{{$t('profilPage.registerEmail')}}</v-btn>
      </div>
    </v-flex>
  </v-layout>

</template>

<script>
export default {
  data () {
    return {
      emailAddress: ''
    }
  },
  methods: {
    registerEmailAddress() {
      this.$http.post('updateUser/registerEmail', {
        email: this.emailAddress
      }, {emulateJSON: true}).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      })
    }
  }
}
</script>

<style lang="css">
</style>
