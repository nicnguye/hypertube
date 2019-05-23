const axios = require('axios');
const cheerio = require('cheerio');
const tnp = require('torrent-name-parser');
const mongoose = require('mongoose')



const mongoDB = 'mongodb://localhost:27017/HyperTube';

mongoose.connect(mongoDB, {useNewUrlParser: true})
let db = mongoose.connection

mongoose.connection.dropDatabase();

// Check  connection
db.once('open', function () {
  console.log('Connected to MongoDB')
})

// Check for db errors
db.on('error', function () {
  console.log('error')
})


let MovieModel = require('../models/movie');

const parseHash = (magnet) => {
	const regex = /magnet:\?xt=urn:btih:(.*?)&/;
	const hash = regex.exec(magnet);
	return hash[1];
}

const toJSON = (data) => {
    const processed = {
        title: null,
        magnet: null
    }
    return Object.assign(processed, data)
}

const enrich = (movie, res) => {
	return {
		...movie,
		imdb: res.imdbID,
		title: res.Title,
		rating: parseInt(res.imdbRating),
		year: parseInt(res.Year),
		image: res.Poster,
		genres: ',' + res.Genre + ',',
	};
}

const dataIsValid = (res) => {
	if (res.Response == false)
		return false;
	if (!res.imdbID || !res.imdbID.match(/tt.*/ig))
		return false;
	if (!res.Poster || !res.Poster.match(/https?:\/\/.*/ig))
		return false;
	if (!(parseInt(res.Year) >= 1920 && parseInt(res.Year) <= 2019))
		return false;
	return true;
}

async function main() {
  let i = 1;
  while (i < 30) {
    let res = await axios.get('https://yts.am/api/v2/list_movies.json?limit=50&page=' + i);
    if (!res)
      console.log('error');
    else if (res.data.data.movie_count > 0 && res.data.data.movies)
    {
      for (let key in res.data.data.movies)
      {
        let movieRaw = res.data.data.movies[key];
        let movieAlreadyInDB = await MovieModel.findOne({imdbID: movieRaw.imdb_code});
        if (!movieAlreadyInDB) {
          if (movieRaw.torrents[0].url !== 'magnet:?xt=urn:btih:153ea0dd97152ca8db3228af5a1452355c1ce549&dn=Destroyer.2019.DVDSCR.XviD.AC3-EVO&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969') {
            let movie = new MovieModel();
            movie.imdbID = movieRaw.imdb_code;
            movie.title = movieRaw.title;
            movie.rating = movieRaw.rating;
            movie.year = movieRaw.year;
            movie.coverImage = movieRaw.large_cover_image;
            movie.genres = movieRaw.genres;
            movie.runtime = movieRaw.runtime;
            movie.summary = movieRaw.summary;
            if (movieRaw.torrents) {
              movie.urlTorrent = movieRaw.torrents[0].url;
              movie.hash = movieRaw.torrents[0].hash;
              movie.quality = movieRaw.torrents[0].quality;
              movie.size = movieRaw.torrents[0].size;
              }
            await movie.save();
          }
        }
      }
      i++;
    }
    else
      break;
  }
	const list = [];
	const movies = [];
  let res = await axios.get('https://thepiratebay.org/top/201');
  if (!res)
    console.log('error');
  else {
    const $ = cheerio.load(res.data);
    $('#searchResult tr')
      .each((i, elem) => {
            let title = $(elem).find('td').eq(1).find('.detName a').text();
            let magnet = $(elem).find('td').eq(1).find('.detName + a').attr('href');
			       if (title) {
				title = tnp(title).title;
			}
            if (magnet && title) {
				let hash = parseHash(magnet);
        list.push(toJSON({ magnet, title, hash }));
			}
    })
	 	for (let j = 0; j < list.length; j++) {
		try {
			let res = await axios.get('http://www.omdbapi.com/?t=' + list[j].title + '&apikey=2b1113d6')
			if (dataIsValid(res.data)) {
				movies.push(enrich(list[j], res.data));
				let alreadyExists = await MovieModel.findOne({imdbID: res.data.imdbID});
				if (!alreadyExists) {
          if (list[i].magnet !== 'magnet:?xt=urn:btih:153ea0dd97152ca8db3228af5a1452355c1ce549&dn=Destroyer.2019.DVDSCR.XviD.AC3-EVO&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969') {
  					let movie = new MovieModel();
  					movie.imdbID = res.data.imdbID;
  					movie.title = res.data.Title;
  					movie.rating = res.data.imdbRating;
  					movie.year = res.data.Year;
  					movie.coverImage = res.data.Poster;
  					movie.genres = res.data.Genre;
  					movie.runtime = res.data.Runtime;
  					movie.summary = res.data.Plot;
  					movie.urlTorrent = list[i].magnet;
  					movie.hash = list[i].hash;
  					await movie.save();
  				}
        }
			}
	 	} catch (e) {
			console.log(e);
		}
	 }
	 return process.exit();
 }
}

main();
