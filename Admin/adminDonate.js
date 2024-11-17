submitImg.onchange = evt => {
    const [file] = submitImg.files
    if (file) {
        preview.src = URL.createObjectURL(file)
        preview.style.display = "block"; 
    }
  }