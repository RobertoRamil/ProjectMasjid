/*const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
require('chromedriver');

describe('Admin Login Test', function() {
  this.timeout(60000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('should login with valid credentials, recaptcha click, and 2FA input', async function() {
    await driver.get('http://127.0.0.1:5500/ProjectMasjid/htmlA/adminLogin.html');

    await driver.wait(until.elementLocated(By.id('username')), 10000);
    await driver.findElement(By.id('username')).sendKeys('gamesforgio@gmail.com');
    await driver.findElement(By.id('password')).sendKeys('password');

    try {
      const recaptchaContainer = await driver.findElement(By.id('recaptcha-container'));
      await recaptchaContainer.click();
    } catch (e) {
      console.warn("Recaptcha click skipped:", e.message);
    }

    await driver.findElement(By.id('submit')).click();

    await driver.wait(until.alertIsPresent(), 10000);
    const alertDialog = await driver.switchTo().alert();

    await alertDialog.sendKeys('123456');
    await alertDialog.accept();

    await driver.wait(until.urlContains('adminHome.html'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('adminHome.html');
  });
});*/
