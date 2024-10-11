document.addEventListener("DOMContentLoaded", function(){
    console.log("Ready");
});

function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById(tabName);
    activeTab.classList.add('active');
}
