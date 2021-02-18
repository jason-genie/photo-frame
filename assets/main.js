var canvas = new fabric.Canvas('preview_panel');
var filename = 'filename.png';
var ratio = 1;
var download = function(){
  var link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(
    { format: 'png' }
  );
  link.click();
}

window.updatePreview = function(url) {
  
  fabric.Image.fromURL(url, function(img) {
    var oImg = img.set({ left: 0, top: 0}).scale(ratio);
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

$(document).ready(function(){
  fabric.Image.fromURL('./assets/postkarte-0.png', function(img) {
      ratio = canvas.width / img.width;
      var oImg = img.set({ left: 0, top: 0}).scale(ratio);
      canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
  });
  $(".design").on("click", function(){
    $("#fg").attr("src", $(this).attr("src")).data("design", $(this).data("design"));
    $(".design.active").removeClass("active");
    $(this).addClass("active");
    fabric.Image.fromURL($(this).attr("src"), function(img) {
      canvas.overlayImage = null;
      canvas.renderAll.bind(canvas);
      ratio = canvas.width / img.width;
      var oImg = img.set({ left: 0, top: 0}).scale(ratio);
      canvas.setOverlayImage(oImg, canvas.renderAll.bind(canvas));
    });
  });
});