// Import the necessary modules from selenium-webdriver
const {Builder, Browser, By, until} = require('selenium-webdriver');

async function testLogin(username, password) {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('http://mmscenter.org'); // Replace with the actual path to your HTML file
    
  } finally {
    await driver.quit();
  }
}