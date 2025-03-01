document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "../html/header.html");
    loadComponent("footer", "../html/footer.html");
});

function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}
