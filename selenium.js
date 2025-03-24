// Import the necessary modules from selenium-webdriver
const {Builder, Browser, By, until} = require('selenium-webdriver');
const { default: Symbols } = require('selenium-webdriver/lib/symbols');
const assert=require('assert');

async function testLogin(username, password) {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('http://mmscenter.org'); // Replace with the actual path to your HTML file
    
  } finally {
    await driver.quit();
  }
}
/*
Currently this is hardcoded to start local host on the donate page.
It will later need to be changed to the actual URL as the currently ids
are different.
*/
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
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try{
    await driver.get('http://127.0.0.1:5500/html/donate.html');
    var f1= await driver.findElement(By.id('site-footer'));
    var f2= await f1.findElement(By.id('footer-content'));
    var f3= await f2.findElement(By.id('footer-links'));
    var footerTabs = await f3.findElements(By.className('footer-tab'));
    var tabAmount = footerTabs.length;

    let ogWindow=await driver.getWindowHandle();
   
    //Asserts there is only one window
    assert((await driver.getAllWindowHandles()).length === 1);

    var f4=await f2.findElement(By.id('footer-social'));
    const facebook = f4.findElement(By.id('facebook_footer_link'));

    //Facebook
    await driver.wait(async () => (await facebook.getAttribute('href')) !== '', 5000); // Wait for href to be non-empty
    let targetUrl = await facebook.getAttribute('href');
    await facebook.click();

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );
  
    let window= await driver.getAllWindowHandles();
    let newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
    await driver.switchTo().window(newWindow);
            
    await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 10000);

    let currentUrl= await driver.getCurrentUrl();

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
           
    await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 10000);

  currentUrl= await driver.getCurrentUrl();

   assert.equal(targetUrl,currentUrl);
   console.log('Instagram click passed: Navigated to ',targetUrl);
   await driver.close();
   await driver.switchTo().window(ogWindow);


    //Youtube
    const youtube = f4.findElement(By.id('youtube_footer_link'));
    await driver.wait(async () => (await youtube.getAttribute('href')) !== '', 5000); // Wait for href to be non-empty
    targetUrl = await youtube.getAttribute('href');
    await youtube.click();

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );
 
    window= await driver.getAllWindowHandles();
    newWindow = window.find(handle => handle !== ogWindow); // Find the new window handle
    await driver.switchTo().window(newWindow);
           
    await driver.wait(async () => (await driver.getCurrentUrl()) !== '', 10000);

  currentUrl= await driver.getCurrentUrl();

   assert.equal(targetUrl,currentUrl);
   console.log('Youtube click passed: Navigated to ',targetUrl);
   await driver.close();
   await driver.switchTo().window(ogWindow);


   //Email


   //Google maps
   await driver.wait(until.elementLocated(By.id('map')), 10000);
   assert(await mapContainer.isDisplayed(), 'Google Map container is not displayed.');

   console.log('Google Map test passed: Map loaded successfully.');



   //Go to top of the page button


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

async function runTest(){
  //await testHeaderButtons();
  //console.log();
  await testFooterButtons();
}

runTest();