import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';

describe('Donate Page Tests', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should load the donate page and check the title', async function() {
        await driver.get('http://127.0.0.1:5500/html/donate.html');
        
        // Wait until the title is present
        await driver.wait(until.titleIs('Donate Page'), 30000); // 30 seconds timeout
        
        const title = await driver.getTitle();
        expect(title).to.equal('Donate Page');
    });

    it('should check the presence of Square donation button', async function() {
        await driver.get('http://127.0.0.1:5500/html/donate.html');

        // Wait until the PayPal button is present and visible
        const paypalButton = await driver.wait(until.elementLocated(By.css('.paypal-button')), 30000); // 30 seconds timeout
        const isDisplayed = await paypalButton.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should check if Zelle logo is displayed', async function() {
        await driver.get('http://127.0.0.1:5500/html/donate.html');

        // Wait until the Zelle logo is visible
        const zelleLogo = await driver.wait(until.elementIsVisible(driver.findElement(By.id('zellelogo'))), 30000); // 30 seconds timeout
        const isLogoDisplayed = await zelleLogo.isDisplayed();
        expect(isLogoDisplayed).to.be.true;
    });

    it('should check that the donate text is populated', async function() {
        await driver.get('http://127.0.0.1:5500/html/donate.html');

        // Wait for the text inside the #dntBody element to be non-empty
        const donateBody = await driver.wait(until.elementLocated(By.id('dntBody')), 30000); // Wait for up to 30 seconds
        let text = await donateBody.getText();

        // Retry fetching the text until it is not empty
        let attempts = 0;
        while (text.trim() === '' && attempts < 5) {
            console.log('Waiting for donate text to populate...');
            await driver.sleep(2000); // Wait for 2 seconds before trying again
            text = await donateBody.getText();
            attempts++;
        }

        console.log('Donate Text:', text); // Debug log to check the text
        expect(text).to.not.be.empty;
    });
});
