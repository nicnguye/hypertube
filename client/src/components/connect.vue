<template>
</template>

<script>
export default {
  data () {
    return {
      token: null,
    }
  },
  mounted () {
    this.getToken();
  },
  methods: {
    getToken(){
      this.token = this.$route.query.token;
      this.$store.commit('SET_TOKEN', this.token);
      this.$localStorage.set('token', this.token);
      this.$router.push({name: "profil"});
    }
  }
}

</script>

<style lang="css">
</style>
