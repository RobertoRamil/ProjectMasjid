// Import the necessary modules from selenium-webdriver
const {Builder, Browser, By, until} = require('selenium-webdriver');

async function testPhoneNumberOperations() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    let testsPassed = 0;
    try {
      // Navigate to the web page
      await driver.get('http://127.0.0.1:5500/html/event.html'); 
  
      console.log("Begin phone testing");
      await driver.wait(until.elementLocated(By.id('phoneField')), 5000); 
      const phoneField = await driver.findElement(By.id('phoneField'));
  
      // Valid number test case
      await phoneField.clear();
      await phoneField.sendKeys('123-555-0109');
      const addButton = await driver.findElement(By.id('Psign')); 
      await addButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      let alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'You have joined the newsletter!') { //Ensure the correct result is achieved
        console.log('Test1 passed: Valid number');
        testsPassed ++;
      }
      else {
        console.log('Test1 failed: Valid number');
      }
      console.log('Valid Phone number add test completed \n');
      // End of valid number test case
  
      // Test invalid number case
      await phoneField.clear();
      await phoneField.sendKeys('123');
      await addButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText());
      await alert.accept(); 
      if (await alert.getText() === 'Invalid Phone number') { //Ensure the correct result is achieved
        console.log('Test2 passed: Invalid number');
        testsPassed ++;
      }
      else {
        console.log('Test2 failed: Invalid number');
      }
      console.log('Invalid Phone number add test completed \n');
      // End of invalid number test case
  
      // Test duplicate number case
      await phoneField.clear();
      await phoneField.sendKeys('1235550109'); //Also shows that the regex is functioning properly
      await addButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'Phone number already enrolled!') { //Ensure the correct result is achieved
        console.log('Test3 passed: Duplicate number & Regex');
        testsPassed ++;
      }
      else {
        console.log('Test3 failed: Duplicate number & Regex');
      }
      console.log('Duplicate Phone number add test completed \n');
      // End of duplicate number test case
  
  
  
  
  
      // Test removing the phone number
      await phoneField.clear();
      await phoneField.sendKeys('123-555-0109');
      const removeButton = await driver.findElement(By.id('Premove'));
      await removeButton.click();
      await driver.wait(until.alertIsPresent(), 5000); 
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText());
      await alert.accept(); 
      if (await alert.getText() === 'Phone number successfully unenrolled from newsletter.') { //Ensure the correct result is achieved
        console.log('Test4 passed: Valid number removal');
        testsPassed ++;
      }
      else {
        console.log('Test4 failed: Valid number removal');
      }
      console.log('Valid phone number removal test complete \n');
      // End of removing phone number test case
  
      // Test removing a non-existent phone number
      await phoneField.clear();
      await phoneField.sendKeys('000-000-0000');
      await removeButton.click();
      await driver.wait(until.alertIsPresent(), 5000);
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText());
      await alert.accept(); 
      if (await alert.getText() === 'Phone number not enrolled in the newsletter.') { //Ensure the correct result is achieved
        console.log('Test5 passed: Non-existent number removal');
        testsPassed ++;
      }
      else {
        console.log('Test5 failed: Non-existent number removal');
      }
      console.log('Non-existent phone number removal test complete \n');
      


      // Begin email testing
      console.log("Begin email testing");
      await driver.wait(until.elementLocated(By.id('emailField')), 5000); 
      const emailField = await driver.findElement(By.id('emailField'));

      //Valid email test
      await emailField.clear();
      await emailField.sendKeys('123@mmscenter.com');
      const addEButton = await driver.findElement(By.id('Esign')); 
      await addEButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'You have joined the newsletter!') { //Ensure the correct result is achieved
        console.log('Test1 passed: Valid email');
        testsPassed ++;
      }
      else {
        console.log('Test1 failed: Valid email');
      }
      console.log('Valid email add test completed \n');
      

      //Invalid email testing
      await emailField.clear();
      await emailField.sendKeys('123');
      await addEButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'Invalid Email') { //Ensure the correct result is achieved
        console.log('Test2 passed: Invalid email');
        testsPassed ++;
      }
      else {
        console.log('Test2 failed: Invalid email');
      }
      console.log('Invalid email add test completed \n');

      //Duplicate email testing
      await emailField.clear();
      await emailField.sendKeys('123@mmscenter.com');
      await addEButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'Email already enrolled!') { //Ensure the correct result is achieved
        console.log('Test3 passed: Duplicate email');
        testsPassed ++;
      }
      else {
        console.log('Test3 failed: Duplicate email');
      }
      console.log('Duplicate email add test completed \n');
      

      //Remove valid email test
      await emailField.clear();
      await emailField.sendKeys('123@mmscenter.com');
      const removeEButton = await driver.findElement(By.id('Eremove')); 
      await removeEButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'Email successfully unenrolled from the newsletter.') { //Ensure the correct result is achieved
        console.log('Test4 passed: Valid email removal');
        testsPassed ++;
      }
      else {
        console.log('Test4 failed: Valid email removal');
      }
      console.log('Valid email removal test completed \n');

      //Remove non-existent email
      await emailField.clear();
      await emailField.sendKeys('123@mmscenter.com');
      await removeEButton.click();
      await driver.wait(until.alertIsPresent(), 5000); // Wait for the alert to appear
      alert = await driver.switchTo().alert();
      console.log('Alert text:', await alert.getText()); 
      await alert.accept(); 
      if (await alert.getText() === 'Email not enrolled in the newsletter.') { //Ensure the correct result is achieved
        console.log('Test5 passed: Non-esistent email removal');
        testsPassed ++;
      }
      else {
        console.log('Test5 failed: Non-existent email removal');
      }
      console.log('Non-existent email removal test completed \n');
      

  
  


      console.log("Tests passed: " + testsPassed + " / 10");
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      // Close the browser
      await driver.quit();
    }
  }
  
  // Call the test function
  testPhoneNumberOperations();
  