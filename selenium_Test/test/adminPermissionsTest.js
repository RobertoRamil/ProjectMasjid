import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';
import 'chromedriver';

describe('Admin Permissions Page Tests', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    
    it('Admin created with Socials permissions', async function () {
        this.timeout(120000); // Increase timeout to 60 seconds
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        const username = await driver.findElement(By.id('username'));
        const password = await driver.findElement(By.id('password'));
        const submit = await driver.findElement(By.id('submit'));

        await username.sendKeys('gamesforgio@gmail.com');
        await password.sendKeys('password');
        await submit.click();

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
        
        
        // Navigate to Permissions page
        await driver.sleep(5000);
        
        const adminEmail = await driver.findElement(By.id('adminEmail'));
        await adminEmail.sendKeys('realgiovanynunez@gmail.com');

        const adminPhoneNumberCountryCode = await driver.findElement(By.id('adminPhoneNumberCountryCode'));
        await adminPhoneNumberCountryCode.sendKeys('1');

        const adminPhoneNumber = await driver.findElement(By.id('adminPhoneNumber'));
        await adminPhoneNumber.sendKeys('1234567890');

        const adminPassword = await driver.findElement(By.id('adminPassword'));
        await adminPassword.sendKeys('password');

        const canEditSocials = await driver.findElement(By.id('canEditSocials'));
        await canEditSocials.click();

        const createAdminBtn = await driver.findElement(By.id('createAdminBtn'));
        await createAdminBtn.click();
        await driver.sleep(2000);

    });
    
    it('Admin permissions changed to edit just Payments', async function () {
        this.timeout(60000); // Increase timeout to 60 seconds
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        const username = await driver.findElement(By.id('username'));
        const password = await driver.findElement(By.id('password'));
        const submit = await driver.findElement(By.id('submit'));

        await username.sendKeys('gamesforgio@gmail.com');
        await password.sendKeys('password');
        await submit.click();

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
        
        // Navigate to Permissions page
        await driver.sleep(5000);

        const adminDropDown2 = await driver.findElement(By.id('adminDropDown2'));
        const adminOption = await driver.findElement(By.xpath("//select[@id='adminDropDown2']/option[@value='realgiovanynunez@gmail.com']"));
        await adminOption.click();
        await driver.sleep(2000);

        const canEditPaymentsCheckbox = await driver.findElement(By.id('canEditPaymentsCheckbox'));
        await canEditPaymentsCheckbox.click();

        const canEditSocialsCheckbox = await driver.findElement(By.id('canEditSocialsCheckbox'));
        await canEditSocialsCheckbox.click();
        await driver.sleep(2000);
    });
    
    it('Admin deleted', async function () {
        this.timeout(60000); // Increase timeout to 60 seconds
        await driver.get('http://127.0.0.1:5500/htmlA/adminLogin.html');
        const username = await driver.findElement(By.id('username'));
        const password = await driver.findElement(By.id('password'));
        const submit = await driver.findElement(By.id('submit'));

        await username.sendKeys('gamesforgio@gmail.com');
        await password.sendKeys('password');
        await submit.click();

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
        
        // Navigate to Permissions page
        await driver.sleep(5000);

        const adminDropDown2 = await driver.findElement(By.id('adminDropDown2'));
        await adminDropDown2.click();

        const admin = await driver.findElement(By.xpath("//option[@value='realgiovanynunez@gmail.com']"));
        await admin.click();

        const deleteAdminBtn = await driver.findElement(By.id('deleteAdminBtn'));
        await deleteAdminBtn.click();
        await driver.sleep(2000);
        

        await alert.accept();
        await driver.sleep(2000);
    });
    

    





    
});
