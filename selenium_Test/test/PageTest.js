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
    
    
   /* it('should be able to delete announcement', async function () {
        await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
        
        const elements = await driver.findElements(By.className(className));
        let originalWordCount = $(".announcement-row .inner-box").length;

        // announcement textbox
        let announcementTextBox = $("#announcementText");
        
        let randomWord = "test";
        // type random word into announcement box
        $(announcementTextBox).val(randomWord);

        // post button
        let postAnnouncement = $("#submit_announcement");

        //clicks post button
        postAnnouncement.click();

        // after we click button, there's a network request that posts that data to the DB
        // This could take like .5s so lets wait 1s so that the data is properly loaded
        setTimeout(() => {
            // at this point, because we just added a word, word count should be (originalWordCount + 1)

            // this gets the last added word's container
            let lastAddedWordContainer = $(".announcement-row .inner-box").parent().last();
            
            // now we're going to delete the word.
            let deleteButton = lastAddedWordContainer.find(".deleteAnnouncementBtn");

            deleteButton.click();

            // now wait another full second for the delete to process
            setTimeout(() => {
                let endingWordCount = $(".announcement-row .inner-box").length;

                // we just added and deleted a word, we should expect our ending word count
                // to equal our original word count before adding/deleting.
                expect(endingWordCount).to.equal(originalWordCount);


            }, 1000);
        }, 1000);

    });

    it('should be able to add announcement', async function () {
        await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
        
        // announcement textbox
        let announcementTextBox = $("#announcementText");

        function getRandomWord(wordList) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            return wordList[randomIndex];
          }
        
        const words = ["apple", "banana", "cherry", "date", "elderberry"];
        let randomWord = getRandomWord(words);

        // type random word into announcement box
        $(announcementTextBox).val(randomWord);

        // post button
        let postAnnouncement = $("#submit_announcement");

        //clicks post button
        postAnnouncement.click();

        // after we click button, there's a network request that posts that data to the DB
        // This could take like .5s so lets wait 1s so that the data is properly loaded
        setTimeout(() => {
            // this gets the last word added
            let lastAddedWord = $(".announcement-row .inner-box").last().text();

            expect(lastAddedWord).to.equal(randomWord);
        }, 1000);

    });

    it('should be able to change quote', async function () {
        await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
        
        // announcement textbox
        let quoteTextBox = $("#quoteText");

        function getRandomWord(wordList) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            return wordList[randomIndex];
          }
        
        const words = ["apple", "banana", "cherry", "date", "elderberry"];
        let randomWord = getRandomWord(words);

        // type random word into announcement box
        $(quoteTextBox).val(randomWord);

        // post button
        let postQuote = $("#submit_quote");

        //clicks post button
        postQuote.click();

        // after we click button, there's a network request that posts that data to the DB
        // This could take like .5s so lets wait 1s so that the data is properly loaded
        setTimeout(async () => {
            await driver.get('http://127.0.0.1:5500/htmlA/adminHome.html');
            
            let quoteAfterPageRefresh = $("#quoteText").val();
            expect(quoteAfterPageRefresh).to.equal(randomWord);

        }, 1000);

    })*/
});
