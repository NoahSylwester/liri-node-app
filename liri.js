require("dotenv").config();
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var inquirer = require('inquirer');
var fs = require('fs');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var log;

// parse user input despite spaces.
// this removes the need to have one argument in quotations
var parseInput = function () {
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

// define log function
var logData = function() {
  fs.appendFile("log.txt", log, function(err) {

    // log any errors to the console.
    if (err) {
      return console.log(err);
    }
  });
}

// identify user command in run function

function run() {
  // concert function
  if (process.argv[2] === "concert-this") {
    var artist = parseInput();
    var queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    axios.get(queryUrl)
      .then(function (response) {
        // handle success
        var events = [];
        for (let i = 0; i < response.data.length; i++) {
          events.push({
            venue: response.data[i].venue.name,
            location: `${response.data[i].venue.city}, ${response.data[i].venue.country}`,
            date: moment(response.data[i].datetime, 'YYYY-MM-DDThh:mm:ss').format("dddd, MMMM Do YYYY, h:mm a")
          })
        }
        inquirer.prompt([{
          name: "return",
          type: "input",
          message: `Found ${events.length} events.
Please enter the number to return (starting with earliest, default is one).`
        }]).then(function (response) {
          let limit = 1;
          if (response.return !== "") {
            limit = response.return;
            if (limit > events.length) {
              limit = events.length;
            }
          };
          for (let i = 0; i < limit; i++) {
            console.log(`
        Venue: ${events[i].venue}
        Location: ${events[i].location}
        Date: ${events[i].date}
        `);
          }
        // handle log
        log = `
        CONCERT QUERY
        Venue: ${events[i].venue}
        Location: ${events[i].location}
        Date: ${events[i].date}
        `
        logData();
        });
      })
      .catch(function (error) {
        // handle error
        console.log("No events found.");
      })
      .finally(function () {
        // always executed
      });
  }

  // spotify function

  else if (process.argv[2] === "spotify-this-song") {
    var song = parseInput();
    spotify
      .search({ type: 'track', query: song })
      .then(function (response) {
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
      // handle log
      log = `
      SONG QUERY
      Artist(s):${names}
      Track title: ${response.tracks.items[0].name}
      Spotify url: ${response.tracks.items[0].external_urls.spotify}
      Album name: ${response.tracks.items[0].album.name}
    `
      logData();
      })
      .catch(function (err) {
        console.log("Song not found.");
      });
  }

  // movie function

  else if (process.argv[2] === "movie-this") {
    var movie = parseInput();
    var queryUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${movie}`;
    axios.get(queryUrl)
      .then(function (response) {
        // handle success
        console.log(`
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB rating: ${response.data.Ratings[0].Value}
        Rotten Tomatoes rating: ${response.data.Ratings[1].Value}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
    `);
    // handle log
    log = `
      MOVIE QUERY
      Title: ${response.data.Title}
      Year: ${response.data.Year}
      IMDB rating: ${response.data.Ratings[0].Value}
      Rotten Tomatoes rating: ${response.data.Ratings[1].Value}
      Country: ${response.data.Country}
      Language: ${response.data.Language}
      Plot: ${response.data.Plot}
      Actors: ${response.data.Actors}
`
    logData();
      })
      .catch(function (error) {
        // handle error
        console.log("Movie not found.");
      })
      .finally(function () {
        // always executed
      });
  }
  else if (process.argv[2] === "do-what-it-says") {
    // read in random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {

      // logs any errors
      if (error) {
        return console.log(error);
      }

      // alters the process to put the contents of random.txt as new arguments
      var dataArr = data.split(",");
      process.argv.splice(2, 1)
      process.argv.push(dataArr[0], dataArr[1]);
      // then restarts the script
      run();
    });
  }
  else if (process.argv[2] === "help") {
    console.log(`
    ****

    List of commands:

      node liri.js concert-this <artist/band name>...

        Queries the Bands in Town Artist Events API for information
        about upcoming events concerning the input. Displays venue,
        location, and date for a specificed number of events.

      node liri.js spotify-this-song <song name>...

        Queries the Spotify API for information about the input.
        Displays artist(s), song name, external Spotify URL, and album.

      node liri.js movie-this <movie name>...

        Queries the OMDB API for information about the input. Displays
        movie title, release year, ratings form IMDB and Rotten Tomatoes,
        country of origin, language, plot, and actor(s).

      node liri.js do-what-it-says

        Runs the program with inputs from random.txt.

      node liri.js help

        Displays this information again.

    ****
    `)
  }
  else {
    console.log(`
    Command not recognized.
    Please type "node liri.js help" to see a list of recognized commands.
    `)
  }
}
run();