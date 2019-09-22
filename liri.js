require("dotenv").config();
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// parse user input despite spaces.
// this removes the need to have one argument in quotations
var parseInput = function() {
  var parsed = "";
  for (let i = 3; i < process.argv.length; i++) {
    if (i !== process.argv.length - 1) {
      parsed += process.argv[i] + " ";
    }
    else {
      parsed += process.argv[i]
    }
  }
  return parsed;
}

// identify user command
if (process.argv[2] === "concert-this") {
  var artist = parseInput();
}
else if (process.argv[2] === "spotify-this-song") {
  var song = parseInput();
  spotify
  .search({ type: 'track', query: song })
  .then(function(response) {
    var names = [];
    for (let i = 0; i < response.tracks.items[0].artists.length; i++) {
      names.push(" " + response.tracks.items[0].artists[i].name);
    }
    console.log(`
      Artist(s):${names}
      Track title: ${response.tracks.items[0].name}
      Spotify url: ${response.tracks.items[0].external_urls.spotify}
      Album name: ${response.tracks.items[0].album.name}
      `);
  })
  .catch(function(err) {
    console.log(err);
  });
}
else if (process.argv[2] === "movie-this") {
  var movie = parseInput();
}
else if (process.argv[2] === "do-what-it-says") {
  
}