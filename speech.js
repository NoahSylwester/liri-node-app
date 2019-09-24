function speechToText(witTokenInput, run) {
  const recorder = require('node-record-lpcm16');
  const request = require('request');

  const witToken = witTokenInput; // get one from wit.ai!

  const fs = require('fs');

  var textInterpretation = "";

  function parseResult(err, resp, body) {
    if (err) console.error(err)
    // extract text interpretation from response
    textInterpretation = body.substring(body.search("_text") + 10, body.search('",'));
    console.log(`
        You said: ${textInterpretation}
      `);
    if (textInterpretation.search("concert") === 0) {
      process.argv[2] = "concert-this";
      process.argv[3] = textInterpretation.substring(8, textInterpretation.length);
      console.log(process.argv[2] + " " + process.argv[3]);
      run();
    }
    else if (textInterpretation.search("movie") === 0) {
      process.argv[2] = "movie-this";
      process.argv[3] = textInterpretation.substring(6, textInterpretation.length);
      console.log(process.argv[2] + " " + process.argv[3]);
      run();
    }
    else if (textInterpretation.search("spotify") === 0) {
      process.argv[2] = "spotify-this-song";
      process.argv[3] = textInterpretation.substring(8, textInterpretation.length);
      console.log(process.argv[2] + " " + process.argv[3]);
      run();
    }
  }

  const file = fs.createWriteStream('speech.wav', { encoding: 'binary' });
  const recording = recorder.record();

  recording.stream().pipe(file);
  console.log("Now recording...");

  // Stop recording after three seconds
  setTimeout(() => {
    recording.stop();
    console.log("Finished recording.")
    var soundFile;
    fs.readFile('speech.wav', { encoding: 'binary' }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        soundFile = data;
        fs.createReadStream('speech.wav').pipe(request.post({
          'url': 'https://api.wit.ai/speech?v=20170307',
          'headers': {
            'Authorization': `Bearer ${witToken}`,
            'Content-Type': 'audio/wav',
            "Transfer-encoding": "chunked"
          },
          "data-binary": soundFile
        }, parseResult));
      }
    });
  }, 5000)
}
module.exports = speechToText;