// Isolate images on page
// Sample ~5 of them
var images = $.map($("img"), img => getBase64Image(img));

// Send to classify webservice
$.ajax({
  type: "POST",
  url: "http://localhost:8000",
    data: JSON.stringify(images),
  //contentType: "application/json; charset=utf-8", // causes requests to be preflighted
  //dataType: "json",
  success: function (data) {
    console.log(data)
    if(data.block){block();}
  },
  error: function (jqXHR, exception) {
    alert(exception)
  }
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
