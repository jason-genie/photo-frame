
var defaultWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var cw = (defaultWidth * 0.5) > 250 ? (defaultWidth * 0.5) : 250;
var canvas = new fabric.Canvas('preview_panel', {width: cw, height:cw / 1280 * 853});
var filename = 'filename.png';
var imgMultiplier = 1;
var imgRatio = 1;
var ocw = cw;
var och = cw / 1280 * 853;

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

function freshCanvas() {
  fabric.Image.fromURL($(".design.active").attr("src"), function(img) {
    imgRatio = img.width / img.height;
    var winWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    ocw = canvas.width;
    cw = (winWidth * 0.5) > 250 ? (winWidth * 0.5) : 250;
    canvas.setWidth(cw);
    canvas.setHeight(cw / imgRatio);
    imgMultiplier = canvas.width / img.width;
    var oImg = img.set({ left: 0, top: 0}).scale(imgMultiplier);
    canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
  });
}

$(document).ready(function(){
  freshCanvas();

  $(".design").on("click", function(){
    $("#fg").attr("src", $(this).attr("src")).data("design", $(this).data("design"));
    $(".design.active").removeClass("active");
    $(this).addClass("active");
    freshCanvas();
  });

  $(window).on('resize', function() {
    fabric.Image.fromURL($(".design.active").attr("src"), function(img) {
      imgRatio = img.width / img.height;
      var winWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      ocw = canvas.width;
      cw = (winWidth * 0.5) > 250 ? (winWidth * 0.5) : 250;
      
      var zoom = ocw / cw;
      var objects = canvas.getObjects();
      for(var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
  
        var tempScaleX = scaleX * (1 / zoom);
        var tempScaleY = scaleY * (1 / zoom);
        var tempLeft = left * (1 / zoom);
        var tempTop = top * (1 / zoom);
  
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;
  
        objects[i].setCoords();
      }
      
      canvas.setWidth(cw);
      canvas.setHeight(cw / imgRatio);
      imgMultiplier = canvas.width / img.width;
      var oImg = img.set({ left: 0, top: 0}).scale(imgMultiplier);
      canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
    });
    canvas.renderAll.bind(canvas);
  });

  canvas.on('mouse:over', function(e) {
    if (e.target == null)
      return;
    canvas.overlayImage.opacity = 0.5;
    canvas.renderAll();
  });

  canvas.on('mouse:out', function(e) {
    canvas.overlayImage.opacity = 1;
    canvas.renderAll();
  });
});