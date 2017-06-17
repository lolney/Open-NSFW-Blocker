// Isolate images on page
// Sample ~5 of them
var images = $("img").map(img => getBase64Image(img));

alert("This script has run");
// Send to classify webservice
$.ajax({
  type: "POST",
  url: "localhost",
    data: JSON.stringify({"images": images}),
  contentType: "application/json; charset=utf-8",
  dataType: "json",
  success: function (data) {
    if(data.block){block();}
  },
  error: function () {}
});

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
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

// Block the page from loading
function block(){
  
}
