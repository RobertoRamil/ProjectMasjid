document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "User/header.html");
    loadComponent("footer", "User/footer.html");
});

function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}
