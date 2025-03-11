document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});
/*This shows the preview of the image uploaded*/
zelleSubmitImg.onchange = evt => {
    const [file] = zelleSubmitImg.files
    if (file) {
        zelle_preview.src = URL.createObjectURL(file);
        zelle_preview.style.display = "block"; 
    }
  }