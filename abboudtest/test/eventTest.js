const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
require('chromedriver');

describe('Event Page Feature Tests', function () {
    this.timeout(30000); // Set timeout for Selenium operations
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/ProjectMasjid/html/event.html'); // Adjust if path differs
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    it('should display the correct page title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('MMSC');
    });

    it('should display the calendar header', async () => {
        const header = await driver.findElement(By.className('cal_header'));
        const isDisplayed = await header.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should have a month/year title in the calendar', async () => {
        const title = await driver.findElement(By.id('monthYear'));
        const text = await title.getText();
        expect(text).to.not.be.empty;
    });

    it('should display the event list section', async () => {
        const listHeader = await driver.findElement(By.css('.event-box h3'));
        const text = await listHeader.getText();
        expect(text).to.include('Event List');
    });

    it('should display the newsletter email and phone input fields', async () => {
        const emailInput = await driver.findElement(By.id('emailField'));
        const phoneInput = await driver.findElement(By.id('phoneField'));
        expect(await emailInput.isDisplayed()).to.be.true;
        expect(await phoneInput.isDisplayed()).to.be.true;
    });

    it('should display the iframe for the Google Form', async () => {
        const iframe = await driver.findElement(By.css('.iframe-container iframe'));
        expect(await iframe.isDisplayed()).to.be.true;
    });

    it('should display the header and footer', async () => {
        const header = await driver.findElement(By.id('header'));
        const footer = await driver.findElement(By.id('footer'));
        expect(await header.isDisplayed()).to.be.true;
        expect(await footer.isDisplayed()).to.be.true;
    });
});
