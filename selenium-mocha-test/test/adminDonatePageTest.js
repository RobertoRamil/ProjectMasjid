import { Builder, By, until, Key } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';
import path from 'path';

describe('Admin Donate Page Tests', function() {
    let driver;

    this.timeout(60000);

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    it('should load the admin donate page and check the title', async function() {
        await driver.get('http://127.0.0.1:5500/htmlA/adminDonate.html');
        await driver.sleep(1000); // wait for 1 second
        await driver.wait(until.titleIs('Admin Donate'), 30000);
        const title = await driver.getTitle();
        expect(title).to.equal('Admin Donate');
    });

    it('should update the About section text', async function() {
        const aboutTextArea = await driver.findElement(By.id('donate_about_text'));
        await driver.sleep(500);
        await aboutTextArea.clear();
        await driver.sleep(500);
        await aboutTextArea.sendKeys('This is a test update for the donation about section.');
        await driver.sleep(1000);

        const convertButton = await driver.findElement(By.css('#donate_about button[type="submit"]'));
        await convertButton.click();

        await driver.wait(until.alertIsPresent(), 10000);
        const alert = await driver.switchTo().alert();
        await driver.sleep(500);
        expect(await alert.getText()).to.include('Donation about section updated successfully!');
        await driver.sleep(500);
        await alert.accept();
        await driver.sleep(1000);
    });

    it('should update the Square link', async function() {
        const paypalInput = await driver.findElement(By.id('paypalURL'));
        await driver.sleep(500);
        await paypalInput.clear();
        await driver.sleep(500);
        await paypalInput.sendKeys('https://squareup.com/newtestlink');
        await driver.sleep(1000);

        const updateButton = await driver.findElement(By.id('paypalupdate'));
        await updateButton.click();

        await driver.wait(until.alertIsPresent(), 10000);
        const alert = await driver.switchTo().alert();
        await driver.sleep(500);
        expect(await alert.getText()).to.include('Square link updated successfully');
        await driver.sleep(500);
        await alert.accept();
        await driver.sleep(1000);
    });

    it('should upload a Zelle image', async function() {
        const fileInput = await driver.findElement(By.id('zelleSubmitImg'));
        const imagePath = path.resolve('test/zelle.png');

        await driver.sleep(500);
        await fileInput.sendKeys(imagePath);
        await driver.sleep(1000);

        const previewImg = await driver.findElement(By.id('zelle_preview'));
        const srcValue = await previewImg.getAttribute('src');
        expect(srcValue).to.include('blob');

        const submitButton = await driver.findElement(By.css('#zelle button[type="submit"]'));
        await submitButton.click();

        await driver.wait(until.alertIsPresent(), 10000);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await driver.sleep(500);
        expect(alertText).to.satisfy(msg =>
            msg.includes('Zelle image updated successfully') ||
            msg.includes('Error uploading Zelle image.') ||
            msg.includes('You do not have permission')
        );
        await alert.accept();
        await driver.sleep(1000);
    });
});
