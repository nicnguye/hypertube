const torrentStream = require('torrent-stream');
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const checkLog = require('../middlewares/checkLog');
const fs = require('fs');
const randomID = require('random-id');
const path = require('path');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({useragent:'TemporaryUserAgent'});
var http = require('http');
var srt2vtt = require('srt-to-vtt');
var mkdirp = require('mkdirp');

//var subtitles = require("./subtitles.js");

let DownloadedMovieModel = require('../models/downloadedMovie');

let times = 0;

router.post('/', asyncHandler(async(req, res) => {
	let firstPiece;
	let lastPiece;
	let got = 0;
	let old = 0;
	let hash = req.body.hash;
	let imdb = req.body.imdbID;
	let movie = null;

	let movieExists = await DownloadedMovieModel.findOne({hash: hash});
	if (movieExists) {
		let path = movieExists.path;
		return res.status(203).send(path);
	}
	let magnet = 'magnet:?xt=urn:btih:' + hash;
	//let magnet = 'magnet:?xt=urn:btih:79816060ea56d56f2a2148cd45705511079f9bca&dn=TPB.AFK.2013.720p.h264-SimonKlose&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337'
	let engine = torrentStream(magnet, {path: './public/films'});
	engine.on('ready', function() {
		engine.files.forEach(async function(file) {
			if ((file.name.substr(file.name.length - 3) == 'mkv' || file.name.substr(file.name.length - 3) == 'mp4' ||
				file.name.substr(file.name.length - 3) == 'avi') && times == 0 && file.name.toLowerCase().substr(0 , 6) != "sample")
			{

				movie = new DownloadedMovieModel();
        movie.hash = hash;
        movie.path = "http://localhost:8081/films/" + file.path;
        movie.downloaded = 0;
        movie.date = Date.now();

		    await movie.save();

				let stream = file.createReadStream();

				var fileStart = file.offset;
				var fileEnd = file.offset + file.length;

				var pieceLength = engine.torrent.pieceLength;

				firstPiece = Math.floor(fileStart / pieceLength);
				lastPiece = Math.floor((fileEnd - 1) / pieceLength);
				times = 1;
				var path = file.path.replace('\\', '/');
				path = path.split('/')[0];
				res.status(200).send(movie.path);
				downloadSubtitles(hash, imdb, path, file.path, file.name);
			}
		});
	});
	engine.on('download', function(data) {
		if (data >= firstPiece && data <= lastPiece)
		{
			got++;
			let percent = (got / (lastPiece + 1)) * 100;
			percent = Math.round(percent);
			console.log(percent + "%");
			if (percent >= old + 1)
			{
				movie.downloaded = percent;
				movie.save();
			}
			if (percent == 100) {
				times = 0;
			}
		}
	});
	/*engine.on('idle', function() {
		times = 0;
	})*/
}));

function downloadSubtitles(hash, imdb, path, file, name) {
	let lang = ['fre', 'eng'];
	OpenSubtitles.search({
		sublanguageid: lang.join(),
		hash: hash,
		path: file,
		filename: name,
		extensions: ['srt'],
		imdbid: imdb,
	}).then(subtitles => {
		mkdirp('../client/static/' + path, function(err) {
			console.log(err);
		});
		if (subtitles['en'] && !fs.existsSync("../client/static/" + path + "/en.srt") && !fs.existsSync("../client/static/" + path + "/en.vtt"))
		{
			var fileen = fs.createWriteStream("../client/static/" + path + "/en.srt");
			var requesten = http.get(subtitles['en']['url'], function(response) {
				response.pipe(fileen);
				fileen.on('finish', function() {
					fileen.close();
					fs.createReadStream("../client/static/" + path + "/en.srt")
						.pipe(srt2vtt())
						.pipe(fs.createWriteStream("../client/static/" + path + "/en.vtt"))
				});
			});
		}
		if (subtitles['fr'] && !fs.existsSync("../client/static/" + path + "/fr.srt") && !fs.existsSync("../client/static/" + path + "/fr.vtt"))
		{
			filefr = fs.createWriteStream("../client/static/" + path + "/fr.srt");
			requestfr = http.get(subtitles['fr']['url'], function(response) {
				response.pipe(filefr);
				filefr.on('finish', function() {
					filefr.close();
					fs.createReadStream("../client/static/" + path + "/fr.srt")
						.pipe(srt2vtt())
						.pipe(fs.createWriteStream("../client/static/" + path + "/fr.vtt"))
				});
			});
		}
});
}

module.exports = router;
