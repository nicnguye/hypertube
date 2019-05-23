<template>
  <div class="">
    <div class="suggestions-big-box-advancedSearch">
      <v-btn dark class="cyan" @click="sortByYear()">{{$t('moviesPage.searchYear')}}</v-btn>
      <v-btn dark class="cyan" @click="sortByName()">{{$t('moviesPage.searchName')}}</v-btn>
      <v-btn dark class="cyan" @click="sortByRating()">{{$t('moviesPage.searchRating')}}</v-btn>

    <v-menu offset-y data-app>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" class="cyan" v-on="on">{{$t('moviesPage.searchGenre')}}</v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="(item, index) in genres"
          :key="index"
          @click="searchByGenre"
        >
          <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    </br>
    <v-text-field type="text" :hint="$t('form.pressEnter')" name="searchField" v-model="searchField" :placeholder="$t('moviesPage.search')" @keyup.enter.native="searchMovieTitle()" /></v-text-field>
    </div>
    <div class="suggestions-big-box" v-if="user">
          <div v-if="suggestions">
            <div v-if="suggestions.length === 0">
              There is no movie in our database!
            </div>
          </div>

          <div v-for="movie in currentSuggestions" class="suggestions-profil">
            <img class="suggestions-profil-picture" @click="showMovie(movie)" v-bind:style="{ backgroundImage: 'url(' + movie.coverImage + ')'}" v-if="movie.coverImage">
            <img class="suggestions-profil-picture" @click="showMovie(movie)" v-bind:style="{ backgroundImage: 'url(' + require('../assets/picture-not-available.jpg') + ')'}" v-else>
            <h3>{{movie.title}} ({{movie.year}}),<br/> {{$t('moviesPage.rating')}} {{movie.rating}}</h3>
          </div>

    </div>

    <div class="pagination-bottom">
      <div class="text-xs-center">
        <v-pagination v-model="currentPage" :length="this.totalPage" :total-visible="7" @input="getPage" color="cyan" circle ></v-pagination>
      </div>
    </div>


    <div class="show-user-details" v-if="popup">
      <div class="show-user-details-profil">
        <img class="show-user-close-button" @click="closeProfil()" src="../assets/cancel.svg" v-if="cancel">
        <div class="show-user-global">
        <v-layout row wrap>
        <v-flex xs6>
        <div class="show-user-picture"  v-bind:style="{ backgroundImage: 'url(' + this.movieToShow.coverImage + ')' }"></div>
        </v-flex>
        <v-flex xs6>
        <div class="show-user-infos">
          <div class="show-user-infos-names">
            {{this.movieToShow.title}} <br/> ({{this.movieToShow.year}})
          </div>
          </br>
          <p>Was rated {{this.movieToShow.rating}} on IMDB</p>
          <img class="show-movie-watched" v-if="this.watched" src="../assets/watched.jpg">
        </div>
        </v-flex>
        <v-flex xs12 class="flex-description">
          <div class="show-user-infos-description">
            Description: {{this.movieToShow.summary}} <br/>
          </div>
        </v-flex>
        <v-flex xs12>
          <div v-if="movieToShow">
            <div class="show-user-infos-tags">
            </br>  Genres: {{this.movieToShow.genres}}
            </div>
            </br>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-btn class="watch-this-movie-button" @click="downloadMovie()">
            <v-icon left>remove_red_eye</v-icon>
            {{$t('moviesPage.watch')}}
          </v-btn>
          </br>
        </v-flex>
        <v-flex xs12>
          <div v-if="loading">
            <p>{{$t('moviesPage.loading')}}</p>
            <v-progress-circular indeterminate color="red"></v-progress-circular>
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
      user: null,
      suggestions: null,
      popup: false,
      error: null,
      showError: false,
      watched: false,
      searchYear: 1,
      searchName: 1,
      searchGrade: 1,
      searchField: '',
      defaultImage: '../assets/picture-not-available.jpg',
      currentPage: 1,
      totalPage: 15,
      moviesPerPage: 48,
      currentSuggestions: null,
      genres: ['Action', 'Adventure', 'Animation', 'Comedy', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Farouk', 'Horror', 'Music', 'Romance', 'Sci-Fi', 'Thriller'],
      loading: false,
      cancel: true
    }
  },
  mounted () {
  this.getUser();
  if (!this.token)
    this.$router.push('login')
  else
    this.getSuggestions();
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
      getSuggestions() {
        this.$http.post('getMovieSuggestions', {
          token: this.token
        }, {emulateJSON: true}).then((res) => {
          this.suggestions = res.body
          this.suggestions.sort(function(a, b){return b.rating - a.rating})


          this.totalPage = Math.ceil(this.suggestions.length/this.moviesPerPage)
          let max = (this.moviesPerPage * this.currentPage);
          let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
          this.currentSuggestions = this.suggestions.slice(min, max);
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      showMovie(movie) {
        this.movieToShow = movie;
        this.movie = movie;
        this.$http.post('movie/checkIfWatched', {
          token: this.token,
          movie: movie._id
        }, {emulateJSON: true}).then((res) => {
          this.watched = res.body
          this.popup = true
        }, (err) => {
          this.error = err
          this.showError = true
        })
      },
      closeProfil() {
        this.popup = false;
        this.loading = false;
      },
      downloadMovie() {
        this.$http.post('torrentStream', {
          hash: this.movie.hash,
          imdbID: this.movie.imdbID
      }, {emulateJSON: true}).then((res) => {
        this.setMovieWatched();
        if (res.status == 203) {
          let that = this;
          this.loading = true;
          setTimeout( function() {that.$router.push({name: 'watch', params: {moviePath: res.body}})}, 1000 )
        } else if (res.status == 200) {
          let that = this;
          this.loading = true;
          this.cancel = false;

          setTimeout( function() {that.$router.push({name: 'watch', params: {moviePath: res.body}})}, 120000 )
        }
      }, (err) => {
        this.loading = false;
        this.cancel = true;
      })
    },
    setMovieWatched() {
      this.$http.post('movie/setMovieWatched', {
        movie: this.movie._id,
        token: this.token
      }, {emulateJSON: true}).then((res) => {
        this.error = false
      }, (err) => {
        this.error = err
      })
    },
    sortByYear() {
      if (this.searchYear == 1) {
        this.suggestions.sort(function(a, b){return a.year - b.year})
        this.searchYear = 0
    } else {
      this.suggestions.sort(function(a, b){return b.year - a.year})
      this.searchYear = 1
    }
      let max = (this.moviesPerPage * this.currentPage);
      let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
      this.currentSuggestions = this.suggestions.slice(min, max);
    },
    sortByName() {
      if (this.searchName == 1) {
        this.suggestions.sort(function(a, b) {return a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1});
        this.searchName = 0
    } else {
      this.suggestions.sort(function(a, b){return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1})
      this.searchName = 1
    }
      let max = (this.moviesPerPage * this.currentPage);
      let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
      this.currentSuggestions = this.suggestions.slice(min, max);
    },
    sortByRating() {
      if (this.searchGrade == 1) {
        this.suggestions.sort(function(a, b){return a.rating - b.rating})
        this.searchGrade = 0
    } else {
      this.suggestions.sort(function(a, b){return b.rating - a.rating})
      this.searchGrade = 1
    }
      let max = (this.moviesPerPage * this.currentPage);
      let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
      this.currentSuggestions = this.suggestions.slice(min, max);
  },
    searchMovieTitle() {
      this.$http.post('getMovieSuggestions/searchMovieName', {
        movieTitle: this.searchField
      }, {emulateJSON: true}).then((res) => {
        this.suggestions = res.body
        this.suggestions.sort(function(a, b){return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1})

        this.currentPage = 1;
        this.totalPage = Math.ceil(this.suggestions.length/this.moviesPerPage);
        let max = (this.moviesPerPage * this.currentPage);
        let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
        this.currentSuggestions = this.suggestions.slice(min, max);
      }, (err) => {
        this.error = err

      })
    },
    searchByGenre(genre){
      let currentGenre = genre.toElement.textContent
      this.$http.post('getMovieSuggestions/searchMovieGenre', {
        movieGenre: currentGenre
      }, {emulateJSON: true}).then((res) => {
        this.suggestions = res.body

        this.currentPage = 1;
        this.totalPage = Math.ceil(this.suggestions.length/this.moviesPerPage);
        let max = (this.moviesPerPage * this.currentPage);
        let min = (this.moviesPerPage * this.currentPage) - this.moviesPerPage;
        this.currentSuggestions = this.suggestions.slice(min, max);
      }, (err) => {
        this.error = err
      })
    },
    getPage(page) {
      let max = (this.moviesPerPage * page);
      let min = (this.moviesPerPage * page) - this.moviesPerPage;
      this.currentSuggestions = this.suggestions.slice(min, max);
      document.documentElement.scrollTop = 0;
    }
  }
}
</script>

<style lang="css">

.pagination {
  height: 20px
}

</style>
