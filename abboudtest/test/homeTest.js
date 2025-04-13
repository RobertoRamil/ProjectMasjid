const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const mocha = require('mocha');
require('chromedriver');


describe('Index.html Feature Tests', function () {
    this.timeout(30000); // Set timeout for Selenium operations
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/ProjectMasjid/html/index.html');

    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('should have the correct page title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('MMSC');
    });

    it('should display the header', async () => {
        const header = await driver.findElement(By.id('header'));
        const isDisplayed = await header.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should display the footer', async () => {
        const footer = await driver.findElement(By.id('footer'));
        const isDisplayed = await footer.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should display the "Quote of the Day" section', async () => {
        const quoteHeading = await driver.findElement(By.id('heading'));
        const headingText = await quoteHeading.getText();
        expect(headingText).to.equal('Quote of the Day');
    });

    it('should display the "Daily Congregational Prayer Time" section', async () => {
        const prayerBox = await driver.findElement(By.id('prayerBox'));
        const isDisplayed = await prayerBox.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should display the image carousel', async () => {
        const carousel = await driver.findElement(By.id('carouselExampleIndicators'));
        const isDisplayed = await carousel.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should navigate through the image carousel', async function () {
        // Wait for at least one item to load in the carousel
        await driver.wait(until.elementLocated(By.css('.carousel-item')), 5000);
      
        const nextBtn = await driver.findElement(By.css('.carousel-control-next'));

        // Wait until the button is visible *and* has size
        await driver.wait(async () => {
          const displayed = await nextBtn.isDisplayed();
          const rect = await nextBtn.getRect();
          return displayed && rect.height > 0 && rect.width > 0;
        }, 5000);
        
        await nextBtn.click();
        await driver.sleep(500); // wait for animation
        
        const activeItem = await driver.findElement(By.css('.carousel-item.active'));
        expect(activeItem).to.exist;
      });
});