# liri-node-app

### A command line tool for gathering information about concerts, songs, and movies built with speech-to-text capability.

#### note: you'll need to run 'npm i' to install all relevant node packages before liri will work. You'll also need your own .env file with Spotify credentials, and you'll need to install the CLI SoX (http://sox.sourceforge.net/) to get the speech function to work.

###### from the help function:

    Thanks for using LiriBot! This is a command line tool for gathering
    information on movies, concerts, and songs.

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

      node liri.js speech

        Records a spoken user input from computer microphone, and executes
        a corresponding search. Commands should be in the form

          <concert/movie/spotify> <name of desired input>

        For example, a user searching for information on the movie
        "Annihilation" would say, "movie Annihilation."

        Uses the Wit.ai Speech API and the node-record-lpcm-16 package:

          https://wit.ai/
          https://www.npmjs.com/package/node-record-lpcm16

      node liri.js help

        Displays this information again.

### A demo of the basic functions

![demo gif](demoBasic.gif)

### A demo of the speech function

![demo gif](demoSpeech.gif)