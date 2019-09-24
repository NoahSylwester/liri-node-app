# liri-node-app

### A command line tool for gathering information about concerts, songs, and movies.

#### note: you'll need to run 'npm i' to install all relevant node packages before liri will work. You'll also need your own .env file with Spotify credentials.

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

      node liri.js help

        Displays this information again.

