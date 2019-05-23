<template>
  <v-footer dense fixed class="black" dark height="auto" color="primary lighten-1">
    <v-layout justify-center row wrap>
      <v-flex primary lighten-2 py-1 text-xs-left white--text xs10>
          &copy;2019 — <strong>HyperTube</strong>
        <strong>by dolivier, fdrias, nicnguye</strong>
      </v-flex>
    </v-layout>
    <v-layout justify-right row wrap>
      <v-flex primary lighten-2 py-1 text-xs-right white--text xs12>
          <button class="navbar-button2" flat dark @click="changeLang()">{{$t('lang')}}</button>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    changeLang() {
      if (this.$i18n.locale == 'en')
        this.$i18n.locale = 'fr'
      else
        this.$i18n.locale = 'en'
    }
  },
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
