function speechToText(witTokenInput, run) {
  const recorder = require('node-record-lpcm16');
  const request = require('request');

  const witToken = witTokenInput; // get one from wit.ai!

  const fs = require('fs');

  var textInterpretation = "";

  // decides what to do with interpreted user input
  function parseResult(err, resp, body) {
    if (err) console.error(err)
    // extract text interpretation from response
    textInterpretation = body.substring(body.search("_text") + 10, body.search('",'));
    console.log(`
        You said: '${textInterpretation}'
      `);
    // concert-this
    if (textInterpretation.search("concert") === 0) {
      process.argv[2] = "concert-this";
      process.argv[3] = textInterpretation.substring(8, textInterpretation.length);
      console.log(">>Command: " + process.argv[2] + " " + process.argv[3]);
      run();
    }
    // movie-this
    else if (textInterpretation.search("movie") === 0) {
      process.argv[2] = "movie-this";
      process.argv[3] = textInterpretation.substring(6, textInterpretation.length);
      console.log(">>Command: " + process.argv[2] + " " + process.argv[3]);
      run();
    }
    // spotify-this-song
    else if (textInterpretation.search("spotify") === 0) {
      process.argv[2] = "spotify-this-song";
      process.argv[3] = textInterpretation.substring(8, textInterpretation.length);
      console.log(">>Command: " + process.argv[2] + " " + process.argv[3]);
      run();
    }
    else { // unrecognized command
      process.argv[2] = "";
      process.argv[3] = "";
      run();
    }
  }

  // create .wav file that we will record into
  const file = fs.createWriteStream('speech.wav', { encoding: 'binary' });
  const recording = recorder.record({
    recorder: 'sox'
  });
  setTimeout(() => {
    console.log("Now recording...")
  }, 1000);

  // begin recording
  recording.stream().pipe(file);
  

  // Stop recording after three seconds
  setTimeout(() => {
    recording.stop();
    console.log("Finished recording.")
    var soundFile;
    // read in .wav as binary data
    fs.readFile('speech.wav', { encoding: 'binary' }, function (err, data) {
      if (err) {
        // log any errors
        console.log(err);
      }
      else {
        // send sound file to wit.ai for interpreting
        soundFile = data;
        fs.createReadStream('speech.wav').pipe(request.post({
          'url': 'https://api.wit.ai/speech?v=20170307',
          'headers': {
            'Authorization': `Bearer ${witToken}`,
            'Content-Type': 'audio/wav',
            "Transfer-encoding": "chunked"
          },
          "data-binary": soundFile
          // call parseResult to interpret output
        }, parseResult));
      }
    });
  }, 5000)
}
// export function to main js
module.exports = speechToText;