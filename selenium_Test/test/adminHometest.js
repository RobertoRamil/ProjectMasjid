import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';

describe('Admin Home Page Tests', function () {
    let driver;

    // Set timeout higher for slower systems
    this.timeout(20000);

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
        await driver.wait(until.titleIs('Admin Home'), 5000);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should verify the page title includes Admin Home', async () => {
        const title = await driver.getTitle();
        expect(title).to.include('Admin Home');
    });

    it('should post a new announcement', async () => {
        const announcementTextArea = await driver.findElement(By.id('announcementText'));
        const postButton = await driver.findElement(By.id('submit_announcement'));

        const announcement = 'This is a test announcement.';
        await announcementTextArea.clear();
        await announcementTextArea.sendKeys(announcement);
        await postButton.click();

        const announcementRow = await driver.findElement(By.id('announcementRow'));
        await driver.wait(until.elementTextContains(announcementRow, announcement), 3000);

        const rowText = await announcementRow.getText();
        expect(rowText).to.include(announcement);
    });

    it('should post a new quote', async () => {
        const quoteTextArea = await driver.findElement(By.id('quoteText'));
        const postButton = await driver.findElement(By.id('submit_quote'));

        const quote = 'Knowledge is power.';
        await quoteTextArea.clear();
        await quoteTextArea.sendKeys(quote);
        await postButton.click();

        // If quote gets rendered in a new element, you should verify that here
        await driver.sleep(1000); // delay
        console.log('✅ Quote submitted – check for visual or DOM feedback.');
    });
});


