// Import the necessary modules from selenium-webdriver
const {Builder, Browser, By, until} = require('selenium-webdriver');
const { default: Symbols } = require('selenium-webdriver/lib/symbols');
const assert=require('assert');
const chrome = require('selenium-webdriver/chrome');



async function adminPlace() {
  try{

  }catch(e){
    console.log(e);
  } finally {
    await driver.quit();
  }
}

async function checkToggle() {
  let driver = new Builder().forBrowser('chrome').build();

  //Newsletter
  await driver.get('http://127.0.0.1:5500/htmlA/adminEvent.html');
  await driver.sleep(3000);
  
  try {
    await driver.get('http://127.0.0.1:5500/html/event.html');
    let news = await driver.findElement(By.id('newsLetter'));
    console.log("News is present.");
  }catch(e){
    console.log("News doesn't exist");
  } 


  await driver.get('http://127.0.0.1:5500/htmlA/adminDonate.html');
  await driver.sleep(3000);
  await driver.get('http://127.0.0.1:5500/html/donate.html');
  await driver.sleep(1000);


  try{
    let paypal = await driver.findElement(By.id('paypal'));
    console.log("paypal is present.");
  }catch(e){
    console.log("paypal doesn't exist");
  } 

  try{
    let zelle = await driver.findElement(By.id('zelle'));
    console.log("zelle is present.");
  }catch(e){
    console.log("zelle doesn't exist");

  } finally {
      await driver.quit();
  }
}

async function testAdminHeaderButtons(){
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try{
    await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
    var header= await driver.findElement(By.id('header'));
    var headerTabs = await header.findElements(By.className('tab'));
    var tabAmount = headerTabs.length;

    for (let i = 0; i <tabAmount; i++) {
      await driver.wait(until.elementLocated(By.id('header')), 5000);
      var header= await driver.findElement(By.id('header'));
      var headerTabs = await header.findElements(By.className('tab'));
      let targetUrl= await headerTabs[i].getAttribute('href');
      await headerTabs[i].click();
      let currentUrl= await driver.getCurrentUrl();

      try {
        assert.equal(targetUrl,currentUrl);
        console.log(`Header button ${i + 1} passed: Navigated to ${currentUrl}`);
      } catch (error) {
        console.error(`Header button ${i + 1} failed: Expected ${targetUrl}, but got ${currentUrl}`);
      }
   }
   

  } finally {
    await driver.quit();
  }
}

async function testHeaderButtons(){
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try{
    await driver.get('http://127.0.0.1:5500/html/donate.html');
    var header= await driver.findElement(By.id('header'));
    var headerTabs = await header.findElements(By.className('tab'));
    var tabAmount = headerTabs.length;

    const logo = header.findElement(By.id('logo'));


    /*Target URL either href if the button has it, or currently hardcoded URL of
      what it should be. the logo being the home page.

      Then it clicks the logo and asserts its the same as the target URL,
      if it is it allows the console log, if not it does an error message.
    */

    let targetUrl= "http://127.0.0.1:5500/html/index.html";
    await logo.click();
    let currentUrl= await driver.getCurrentUrl();
    assert.equal(targetUrl,currentUrl);
    console.log('Logo click passed: Navigated to home page');

    await driver.navigate().back();

    for (let i = 0; i <tabAmount; i++) {
      await driver.wait(until.elementLocated(By.id('header')), 5000);
      var header= await driver.findElement(By.id('header'));
      var headerTabs = await header.findElements(By.className('tab'));
      let targetUrl= await headerTabs[i].getAttribute('href');
      await headerTabs[i].click();
      let currentUrl= await driver.getCurrentUrl();

      try {
        assert.equal(targetUrl,currentUrl);
        console.log(`Header button ${i + 1} passed: Navigated to ${currentUrl}`);
        await driver.navigate().back();
      } catch (error) {
        console.error(`Header button ${i + 1} failed: Expected ${targetUrl}, but got ${currentUrl}`);
      }
   }
   

  }catch(error){
    console.log('Error', error);
  } finally {
    await driver.quit();
  }
}

async function testFooterButtons(){
  let options = new chrome.Options();
  //If want to show the window, comment out headless
  options.addArguments('--headless');
  options.addArguments('--disable-gpu'); 
  let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
  try{
    await driver.get('http://127.0.0.1:5500/html/donate.html');
    var f1= await driver.findElement(By.id('site-footer'));
    var f2= await f1.findElement(By.id('footer-content'));
    var f3= await f2.findElement(By.id('footer-links'));
    var footerTabs = await f3.findElements(By.className('footer-tab'));
    var tabAmount = footerTabs.length;
    let targetUrl="";
    let currentUrl="";  
    let ogWindow=await driver.getWindowHandle();
   
    //Asserts there is only one window
    assert((await driver.getAllWindowHandles()).length === 1);
    
    //Facebook
      var f4=await f2.findElement(By.id('footer-social'));
      const facebook = f4.findElement(By.id('facebook_footer_link'));
      await driver.wait(async () => (await facebook.getAttribute('href')) !== '', 5000); // Wait for href to be non-empty
      targetUrl = await facebook.getAttribute('href');
      await facebook.click();

      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2,
        10000
      );
    
      let window= await driver.getAllWindowHandles();
      let newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
      await driver.switchTo().window(newWindow);
              
      await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 10000);

      currentUrl= await driver.getCurrentUrl();

      assert.equal(targetUrl,currentUrl);
      console.log('Facebook click passed: Navigated to ',targetUrl);
      await driver.close();
      await driver.switchTo().window(ogWindow);


    //Instagram
      const instagram = f4.findElement(By.id('instagram_footer_link'));
      await driver.wait(async () => (await instagram.getAttribute('href')) !== '', 5000); // Wait for href to be non-empty
      targetUrl = await instagram.getAttribute('href');
      await instagram.click();

      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2,
        10000
      );
  
      window= await driver.getAllWindowHandles();
      newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
      await driver.switchTo().window(newWindow);
            
      await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 5000);

    currentUrl= await driver.getCurrentUrl();

    if(targetUrl===currentUrl){
      console.log('Instagram click passed: Navigated to ',targetUrl);
    }else if(currentUrl.includes('instagram.com')){
      console.log('Instagram click passed: Navigated to Instragram login, button works');
    }
    await driver.close();
    await driver.switchTo().window(ogWindow);


    //Youtube
      const youtube = f4.findElement(By.id('youtube_footer_link'));
      await driver.wait(async () => (await youtube.getAttribute('href')) !== '', 1000); // Wait for href to be non-empty
      targetUrl = await youtube.getAttribute('href');
      await youtube.click();

      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2,
        10000
      );
  
      window= await driver.getAllWindowHandles();
      newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
      await driver.switchTo().window(newWindow);
            
      await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 5000);

    currentUrl= await driver.getCurrentUrl();

    
    assert.equal(targetUrl,currentUrl);
    console.log('Youtube click passed: Navigated to ',targetUrl);
    await driver.close();
    await driver.switchTo().window(ogWindow);

   //Go to top of the page button
    const f5 = f1.findElement(By.id('footer-bottom'));
    const moveToTop = f5.findElement(By.id('back-to-top'));

    await driver.executeScript("window.scrollBy(0,document.body.scrollHeight)");  
    moveToTop.click();
    await driver.sleep(1000);

    let scrollPositionAfter = await driver.executeScript('return window.pageYOffset;');

    assert.equal(scrollPositionAfter,0,'The "Go to Top" button did not scroll the page to the top. It scrolls to height: ',scrollPositionAfter);
      
    console.log('Scroll to top button passed: goes to top of page');

   //Email
    const f6 = f2.findElement(By.id('footer-contact'));
    let email=f6.findElement(By.id('email'));
    
    targetUrl = 'mailto:infommsc7392@gmail.com';
          
    currentUrl=await email.getAttribute('href');
  
    assert.equal(targetUrl,currentUrl, `Email link failed, got: ${currentUrl}`);
    console.log('Email passed: Linked to ',targetUrl);

   //Google maps
    let map=await driver.wait(until.elementLocated(By.id('map')), 10000);
    assert(await map.isDisplayed(), 'Google Map container is not displayed.');
    console.log('Google Map test passed: Map loaded successfully.');

    const mapIframe = await driver.switchTo().frame('map');
    const mapIframeClick = await driver.findElement(By.css('body'));
    await mapIframeClick.click();

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      5000
    );

    window= await driver.getAllWindowHandles();
    newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
    await driver.switchTo().window(newWindow);
            
    await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 5000);

    currentUrl= await driver.getCurrentUrl();

    assert.ok(
      currentUrl.includes('https://www.google.com/maps'),
      `Map doesn't go to Google Maps. Current URL: ${currentUrl}`
    );

    console.log('Map click passed: Navigated to ',currentUrl);
    await driver.close();
    await driver.switchTo().window(ogWindow);

    

    //The tabs
      for (let i = 0; i <tabAmount; i++) {
        await driver.wait(until.elementLocated(By.id('site-footer')), 5000);
        var f1= await driver.findElement(By.id('site-footer'));
        var f2= await f1.findElement(By.id('footer-content'));
        var f3= await f2.findElement(By.id('footer-links'));
        var footerTabs = await f3.findElements(By.className('footer-tab'));

        let targetUrl= await footerTabs[i].getAttribute('href');
        await footerTabs[i].click();
        let currentUrl= await driver.getCurrentUrl();

        try {
          assert.equal(targetUrl,currentUrl);
          console.log(`Footer button ${i + 1} passed: Navigated to ${currentUrl}`);
          await driver.navigate().back();
        } catch (error) {
          console.error(`Footer button ${i + 1} failed: Expected ${targetUrl}, but got ${currentUrl}`);
        }
    }
    

  }catch(error){
    console.log('Error', error);
  } finally {
    await driver.quit();
  }
}

async function testprayerBackground(){
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try{
    await driver.get('http://127.0.0.1:5500/html/header.html');
    var filter= await driver.findElement(By.id('filter'));

    let filterValues="";
    
    if (await filter.getCssValue('brightness')) {
      filterValues=await filter.getCssValue('brightness');
      console.log(`filter has a brightness filter: ${filterValues}`);
    } else {
      console.log('filter does not have a brightness filter.');
    }   
    if(await filter.getCssValue('backdrop-filter')) {
      filterValues=await filter.getCssValue('backdrop-filter');
      console.log(`filter has a hue-rotation filter: ${filterValues}`);
    } else {
      console.log(`filter does not have a hue-rotation filter.`);
    }  

    await driver.get('http://127.0.0.1:5500/html/index.html');
    var headerFilter = await driver.findElements(By.className('header'));
    for (let i = 0; i < headerFilter.length; i++) {
      // Re-locate the header elements to avoid stale references
      headerFilter = await driver.findElements(By.className('header'));
      let filterElement = headerFilter[i];
    
      if (await filterElement.getCssValue('brightness')) {
        let filterValues = await filterElement.getCssValue('brightness');
        console.log(`header has a brightness filter: ${filterValues}`);
      } else {
        console.log(`header does not have a brightness filter.`);
      }
    
      headerFilter = await driver.findElements(By.className('header'));
      filterElement = headerFilter[i];
    
      if (await filterElement.getCssValue('backdrop-filter')) {
        let filterValues = await filterElement.getCssValue('backdrop-filter');
        console.log(`header has a hue-rotation filter: ${filterValues}`);
      } else {
        console.log(`header does not have a hue-rotation filter.`);
      }
    }
    

  }catch(error){
    console.log('Error', error);
  } finally {
    await driver.quit();
  }
}


async function runTest(){
  //await testprayerBackground();
  //await testHeaderButtons();
  //await testFooterButtons();

  /*WHEN DOING THIS TWO TEST YOU MUST STOP ALL AUTH  OR IMPORT THE TEST LOGIN */
  //await testAdminHeaderButtons();

  //await checkToggle();
  }

runTest();