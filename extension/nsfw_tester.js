/*
Currently, this will only run on the pages specified in the manifest
*/

toggleBlock();
showMessage("Inspecting page");

// Isolate images on page
// Sample ~5 of them
var sampled = sample($("img"), 10);
var images = $.map(sampled, img => getBase64Image(img));
console.log("Testing")

// Send to classify webservice
$.ajax({
  type: "POST",
  url: "http://localhost:8000",
    data: JSON.stringify(images),
  //contentType: "application/json; charset=utf-8", // causes requests to be preflighted
  //dataType: "json",
  success: function (data) {
    var block = JSON.parse(data);
    if(block){
      console.log("Blocking")
      showMessage("Sorry. This page isn't for you to see.");
    } else {
      console.log("Allowing")
      toggleBlock();
    }
  },
  error: function (jqXHR, exception) {
    alert(exception)
  }
});

function sample(arr, n){
  return _.sample(arr, n);
}

function getBase64Image(img){
	var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

// Block the page from loading
function toggleBlock(){
  Object.values($("body").children()).forEach(elem => {
    elem.hidden = !elem.hidden;
  })
}

function showMessage(message){
  var mbs = $("#messagebox");
  var mb;
  if(mbs.length == 0) {
    mb = $('<h1>', {id:"messagebox"});
    mb.css("text-align","center");
    $("body").append(mb);
  } else {
    mb = mbs;
  }
  mb.html(message);
  mb.show();
}