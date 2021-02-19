var canvas = new fabric.Canvas('preview_panel');
var filename = 'filename.png';
var imgMultiplier = 1;
var imgRatio = 1;
var ocw = 1280;
var och = 853;

var download = function(){
  var link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(
    { format: 'png', multiplier: 1/imgMultiplier }
  );
  link.click();
}

window.updatePreview = function(url) {
  
  fabric.Image.fromURL(url, function(img) {
    var oImg = img.set({ left: 0, top: 0}).scale(imgMultiplier);
    canvas.add(oImg);
  });

  document.getElementById("download").onclick = function(){
    download();
  };
  document.getElementById("download").removeAttribute("disabled");
};

window.onFileChange = function(input){
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    filename = input.files[0].name;
    reader.onload = function (e) {
      image = new Image();
      image.onload = function() {
        var width = this.width;
        var height = this.height;
        if(width >= 800 && height >= 800)
          updatePreview(e.target.result);
        else
          alert("Das Selfie sollte mindestens 800px breit und 800px hoch sein.");
      };
      image.src = e.target.result; 
    }

    reader.readAsDataURL(input.files[0]);
  }
}

// START RESPONSIVE CANVAS

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  setCanvasZoom(ocw / canvas.width);
  canvas.renderAll();    
}

function freshCanvas() {
  fabric.Image.fromURL($(".design.active").attr("src"), function(img) {
    imgRatio = img.width / img.height;
    var winWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    ocw = canvas.width;
    och = canvas.height;
    cw = (winWidth * 0.5) > 250 ? (winWidth * 0.5) : 250;
    canvas.setWidth(cw);
    canvas.setHeight(cw / imgRatio);
    imgMultiplier = canvas.width / img.width;
    var oImg = img.set({ left: 0, top: 0}).scale(imgMultiplier);
    canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
  });

  canvas.renderAll.bind(canvas);
}

function setCanvasZoom(zoom) {
  var objects = canvas.getObjects();
  for(var i in objects) {
     var object = objects[i];
    var scaleX = object.scaleX,
      scaleY = object.scaleY,
      left = object.left,
      top = object.top;
    
    // preserve the original dimensions.
    object.original_scaleX = !object.original_scaleX ? scaleX : object.original_scaleX;
    object.original_scaleY = !object.original_scaleY ? scaleY : object.original_scaleY;
    object.original_left = !object.original_left ? left : object.original_left;
    object.original_top = !object.original_top ? top : object.original_top;
    
    object.scaleX = object.original_scaleX * zoom;
    object.scaleY = object.original_scaleY * zoom;
    object.left = object.original_left * zoom;
    object.top = object.original_top * zoom;
    
    object.setCoords();
  }

  freshCanvas();
};
// END RESPONSIVE CANVAS

$(document).ready(function(){
  freshCanvas();

  $(".design").on("click", function(){
    $("#fg").attr("src", $(this).attr("src")).data("design", $(this).data("design"));
    $(".design.active").removeClass("active");
    $(this).addClass("active");
    freshCanvas();
  });
});