
async function setupDonate(){
    const donateBody = document.getElementById("dntBody");
    body = await getDonateBody();
  
    donateBody.textContent = body;
}
  

 async function setupPaypal(){
    const donatePaypalBody = document.getElementById("payBody");
    body = await getPaypalBody();
  
    donatePaypalBody.textContent = body;
    
    if (body.trim()) {
        donatePaypalBody.innerHTML = `
            <a href="${body}" class="donation-link" target="_blank">
                <button class="paypal-button">Donate with Square</button>
            </a>`;
    }

    
  }

  
  document.addEventListener("DOMContentLoaded", async function() {
    let toggles = await getToggles();
    let paypal=true;
    let zelle=true;


    for(let i=0; i<toggles.length; i++){
        if(toggles[i][0] == "Square"){
          paypal = toggles[i][1];
        }
        if(toggles[i][0] == "Zelle"){
          zelle = toggles[i][1];
        }
    }

    setupDonate();

    if(paypal){
        setupPaypal();
    }else{
      let paypalBody=document.getElementById("paypal");
      paypalBody.remove();
    }

    if(zelle){
      fetchZelleLogo();
    }else{
      let zelleBody=document.getElementById("zelle");
      zelleBody.remove();    
    }
  });
