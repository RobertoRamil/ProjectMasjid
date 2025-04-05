import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';

describe('Admin Login Page Tests', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
    
    it('should load the admin login page and check the title', async function () {
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        await driver.wait(until.titleIs('Admin Login'), 30000);
        const title = await driver.getTitle();
        expect(title).to.equal('Admin Login');
    });

    it('should fail to login with invalid credentials and display an error', async function () {
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        const usernameField = await driver.findElement(By.id('username'));
        const passwordField = await driver.findElement(By.id('password'));
        const submitButton = await driver.findElement(By.id('submit'));

        await usernameField.sendKeys('invalid@example.com');
        await passwordField.sendKeys('wrongpassword');
        await submitButton.click();

        await driver.sleep(500);
        const alertText = await driver.switchTo().alert().getText();
        expect(alertText).to.contain('Error: Username or password incorrect');
        await driver.switchTo().alert().accept();
    });

    it('should attempt to login with valid credentials', async function () {
        this.timeout(60000); // Increase timeout to 60 seconds
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        const usernameField = await driver.findElement(By.id('username'));
        const passwordField = await driver.findElement(By.id('password'));
        const submitButton = await driver.findElement(By.id('submit'));

        await usernameField.sendKeys('gamesforgio@gmail.com');
        await passwordField.sendKeys('password');
        await submitButton.click();

        try {
            await driver.sleep(2000);
            const recaptchaContainer = await driver.findElement(By.id('recaptcha-container'));
            await recaptchaContainer.click();
          } catch (e) {
            console.warn("Recaptcha click skipped:", e.message);
          }

        // Wait for the prompt dialog to appear
        await driver.wait(until.alertIsPresent(), 30000);

        // Switch to the prompt dialog
        const alert = await driver.switchTo().alert();

        // Enter the verification code (e.g., 123456)
        await alert.sendKeys('123456');

        // Accept the prompt dialog
        await alert.accept();
        // Optionally, verify the result (e.g., check if the user is redirected to the admin home page)
        await driver.wait(until.urlIs('http://127.0.0.1:5500/htmlA/adminHome.html'), 5000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/htmlA/adminHome.html');
    });
    


});
