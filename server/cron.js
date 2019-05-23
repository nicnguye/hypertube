const cron = require('node-cron');
var rimraf = require("rimraf");

let DownloadedMovieModel = require('./src/models/downloadedMovie');

module.exports = async function initCron() {
  cron.schedule('0 0 * * *', async function () {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30);
    let moviesToBeDeleted = await DownloadedMovieModel.find({date: {$lte: currentDate}});
    console.log(moviesToBeDeleted);
    for (let key in moviesToBeDeleted) {
        let movie = moviesToBeDeleted[key];
        console.log(movie._id);
        await DownloadedMovieModel.deleteOne({_id: movie._id});
        let name = movie.path.split("films/");
        name[1] = name[1].replace('\\', '/');
        name = name[1].split("/");
        name = name[0];
        rimraf("./public/films/" + name, function(){});
    }
    });
}
