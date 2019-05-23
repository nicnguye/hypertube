<template>
  <div class="">
    <video controls :src="moviePath">
      <source :src="moviePath" type="video/webm">
      <track :label="Label" kind="subtitles" :srclang="srclang" :src="subtitlesPath" default>
      <track :label="Label2" kind="subtitles" :srclang="srclang2" :src="subtitlesPath2"default>
    </video>
    <div class="">
      <br/><br/><br/><br/><br/><br/>
    </div>
    <div class="pl-4 pr-4 pt-2 pb-2">
    <div v-if="comments.length > 0" class="show-comments-film">
      <div v-for="comment in comments" class="show-comments-film-comment">
        <div class="show-comments-author">
          {{comment.username}}:
        </div>
        <div class="show-comments-comment">
          {{comment.commentText}}
        </div>
      </div>
    </div>
    <div v-else class="">
      <h3>{{$t('movie.noComment')}}</h3>
    </div>
    <div class="show-comment-write-new-comment">
    <v-text-field ref="t" :hint="$t('form.pressEnter')" @keyup.enter.native="postComment()" type="text" name="newComment" v-model="newComment" :placeholder="$t('movie.comment')" /></v-text-field>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      token: this.checkToken(),
      movie: null,
      moviePath: this.$route.params.moviePath,
      comments: [],
      error: null,
      showError: false,
      noCommentMessage: '',
      noCommentDisplay: false,
      newComment: '',
      subtitles: null,
      Label: '',
      srclang: '',
      subtitlesPath: '',
      Label2: '',
      srclang2: '',
      subtitlesPath2: '',
      movieInfos: ''
    }
  },
  mounted () {
    this.checkToken();
    this.getMovie();
  },
  methods: {
    checkToken () {
      let token = this.$localStorage.get('token')
      if (token) {
        this.$store.commit('SET_TOKEN', token)
        return(token)
      }
      else {
        this.$store.commit('SET_TOKEN', null)
        this.$router.push('login')
        }
      },
  getMovie() {
    this.$http.post('movie/getMovie', {
      token: this.token,
      moviePath: this.moviePath
    }, {emulateJSON: true}).then((res) => {
      if (res.status === 203) this.$router.push('movies')
      else {
        this.movie = res.body
        this.getComments();
        this.changeDeleteDate();
        var lang = this.$i18n.locale
        var moviePath = this.moviePath
        moviePath = moviePath.split("/");
        moviePath = moviePath[4]
        moviePath = moviePath.split("\\");
        moviePath = moviePath[0]
        if (lang == 'en') {
          this.srclang = 'en'
          this.Label = 'English'
          this.srclang2 = 'fr',
          this.Label2 = "French",
          this.lang2 = 'fr',
          this.subtitlesPath = '../static/' + moviePath + '/en.vtt',
          this.subtitlesPath2 = '../static/' + moviePath + '/fr.vtt'
        } else {
          this.srclang = 'fr'
          this.Label = 'French'
          this.srclang2 = 'en',
          this.Label2 = "English",
          this.lang2 = 'en'
          this.subtitlesPath = '../static/' + moviePath + '/fr.vtt',
          this.subtitlesPath2 = '../static/' + moviePath + '/en.vtt'
      }
      //this.subtitlesPath = './static/' + moviePath + '/' + lang + '.vtt'
      }
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  getComments() {
    this.$http.post('movie/getComments', {
      movie: this.movie._id
    }, {emulateJSON: true}).then((res) => {
      this.comments = res.body
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  postComment() {
    this.$http.post('movie/postComment', {
      token: this.token,
      comment: this.newComment,
      movie: this.movie._id
    }, {emulateJSON: true}).then((res) => {
      this.newComment = ''
      this.$refs.t.blur()
      this.getComments()
    }, (err) => {
      this.error = err
      this.showError = true
    })
  },
  changeDeleteDate() {
    this.$http.post('movie/changeDeleteDate', {
      movie: this.movie._id
    }, {emulateJSON: true}).then((res) => {

    }, (err) => {

    })
  }
  }
}
</script>

<style lang="css" scoped>
</style>
