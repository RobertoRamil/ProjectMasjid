fetchZelleLogo();


async function setupDonate(){
    const donateBody = document.getElementById("dntBody");
    body = await getDonateBody();
  
    donateBody.textContent = body;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    setupDonate();
  });
 setupDonate();

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
  
  document.addEventListener("DOMContentLoaded", function() {
    setupPaypal();
  });
 setupPaypal();