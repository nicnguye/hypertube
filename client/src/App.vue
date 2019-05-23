<template>
  <div id="app">
    <page-header />
    <router-view/>
    <page-footer />
  </div>
</template>

<script>
import PageHeader from '@/components/header.vue'
import PageFooter from '@/components/footer.vue'
export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter
  }
}
</script>

<style>
@import '/assets/css/mycss_lib.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
