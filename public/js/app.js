/**
 * Created by qzhang on 1/11/18.
 */

navigator.mediaDevices.getUserMedia({
    video: true
  })
  .then(function(mediaStream) {
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  }); // always check for errors at the end.

// Elements for taking the snapshot
var canvas = document.getElementById('myCanvas'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
var context = canvas.getContext('2d');
var video = document.getElementById('video');

// Trigger photo take
document.getElementById('snap').addEventListener('click', function() {
  context.drawImage(video, 0, 0, 640, 480);
  var image = canvas.toDataURL();
  image = image.replace('data:image/png;base64,', '');

  var request = {
    "requests": [{
      "image": {
        "content": image
      },
      "features": [{
        "type": "LABEL_DETECTION"
      }]
    }]
  };

  $.ajax({
    method: 'POST',
    url: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAMUvzQRDXvaXnQ0oddE89oCZ2F09rNki8",
    contentType: 'application/json',
    data: JSON.stringify(request),
    processData: false,
    success: function(data) {
      var responseObjLabel = data.responses[0].labelAnnotations;
      console.log(responseObjLabel);
      lableExtract(responseObjLabel);
    },
    error: function(data, textStatus, errorThrown) {
      console.log('error: ' + data);
    }
  })
})

function lableExtract(responseObjLabel) {
  for (var x = 0; x < responseObjLabel.length; x++) {
    var utterance = new SpeechSynthesisUtterance(responseObjLabel[x].description);
    window.speechSynthesis.speak(utterance);
    console.log(responseObjLabel[x].description);
  }
}
