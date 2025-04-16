const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
require('chromedriver');

describe('About Page Feature Tests', function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/ProjectMasjid/html/about.html'); // Adjust if path differs
        await driver.sleep(3000);
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    it('should load the correct page title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('MMSC');
    });

    it('should display the "About" heading', async () => {
        const heading = await driver.findElement(By.css('h2.Webpage-Tab-Title'));
        expect(await heading.getText()).to.equal('About');
    });

    it('should display the information section with heading and paragraph', async () => {
        const infoBox = await driver.findElement(By.css('.information'));
        const heading = await infoBox.findElement(By.id('abtHead'));
        const paragraph = await infoBox.findElement(By.id('abtBody'));
        expect(await heading.isDisplayed()).to.be.true;
        expect(await paragraph.isDisplayed()).to.be.true;
    });

    it('should display the "Meet Our Board of Trustees" section', async () => {
        const teamHeader = await driver.findElement(By.css('.Team h1'));
        expect(await teamHeader.getText()).to.include('Meet Our Board');
    });

    it('should display the members box for team members', async () => {
        const membersBox = await driver.findElement(By.id('membersBox'));
        expect(await membersBox.isDisplayed()).to.be.true;
    });

    it('should display social media icons and links', async () => {
        const facebookIcon = await driver.findElement(By.css('.facebook img'));
        const instagramIcon = await driver.findElement(By.css('.instagram img'));
        const youtubeIcon = await driver.findElement(By.css('.youtube img'));

        expect(await facebookIcon.isDisplayed()).to.be.true;
        expect(await instagramIcon.isDisplayed()).to.be.true;
        expect(await youtubeIcon.isDisplayed()).to.be.true;
    });

    it('should display the header and footer', async () => {
        const header = await driver.findElement(By.id('header'));
        const footer = await driver.findElement(By.id('footer'));
        expect(await header.isDisplayed()).to.be.true;
        expect(await footer.isDisplayed()).to.be.true;
    });
});
