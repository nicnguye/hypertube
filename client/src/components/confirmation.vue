<template>
  <div class="error" v-html="error" v-if="error" />
  <div class="success" v-html="success" v-else-if="success" />
</template>

<script>
export default {
  data () {
    return {
      error: null,
      success: null,
      message: null
    }
  },
  mounted() {
    this.confirmation();
  },
  methods: {
    confirmation () {
      let token = this.$route.params.token;
      this.$http.post('confirmation', {
        token: token
      }, {emulateJSON: true}).then((res) => {
        this.success = res.body + ".   You may login now";
      }, (err) => {
        this.error = err.body;
      })
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
