import { Builder, Browser, By, until } from 'selenium-webdriver';
import { getlinksvals } from '../../js/firebase.js'; // Adjust the relative path as needed

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEditableContentAndSave() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    // Navigate to the adminAbout.html page
    await driver.get('http://127.0.0.1:5500/htmlA/adminAbout.html'); // Replace with your local or deployed URL

    const titleBox = await driver.wait(until.elementLocated(By.id('adminLeftTitle')), 5000);
    const textBox = await driver.wait(until.elementLocated(By.id('adminLeftText')), 5000);
    console.log('Editable content boxes are loaded.');

    // Fetch links using getlinksvals
    let originalLinksVals = await getlinksvals();
    console.log('Fetched links:', originalLinksVals);

    await sleep(2000); // Wait for 2 seconds to ensure the page is fully loaded

    // Save original content to reset after the test
    const originalTitle = await titleBox.getText();
    const originalText = await textBox.getText();

    await titleBox.clear();
    await titleBox.sendKeys('Updated Title for Testing');

    await textBox.clear();
    await textBox.sendKeys('Updated text content for testing purposes.');

    // Trigger the saveAbt button
    const saveButton = await driver.findElement(By.id('saveAbt'));
    await saveButton.click();

    // Handle the alert dialog box
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    console.log('Alert text:', await alert.getText());
    await alert.accept();

    // Reset information to original values
    await titleBox.clear();
    await titleBox.sendKeys(originalTitle);

    await textBox.clear();
    await textBox.sendKeys(originalText);

    await saveButton.click();

    await driver.wait(until.alertIsPresent(), 5000);
    const alert2 = await driver.switchTo().alert();
    console.log('Alert text:', await alert2.getText());
    await alert2.accept();

    // Informational box testing concluded
    console.log('Begin URL testing');

    // Test social media link update boxes and buttons
    const facebookInput = await driver.findElement(By.id('facebookLink'));
    const instagramInput = await driver.findElement(By.id('instagramLink'));
    const youtubeInput = await driver.findElement(By.id('youtubeLink'));

    const facebookButton = await driver.findElement(By.id('updateFacebookLink'));
    const instagramButton = await driver.findElement(By.id('updateInstagramLink'));
    const youtubeButton = await driver.findElement(By.id('updateYouTubeLink'));

    // Update Facebook link
    await facebookInput.clear();
    await facebookInput.sendKeys('https://facebook.com');
    await facebookButton.click();

    // Handle the alert dialog box for Facebook
    await driver.wait(until.alertIsPresent(), 5000);
    const facebookAlert = await driver.switchTo().alert();
    console.log('Facebook Alert text:', await facebookAlert.getText());
    await facebookAlert.accept();

    // Update Instagram link
    await instagramInput.clear();
    await instagramInput.sendKeys('https://instagram.com');
    await instagramButton.click();

    // Handle the alert dialog box for Instagram
    await driver.wait(until.alertIsPresent(), 5000);
    const instagramAlert = await driver.switchTo().alert();
    console.log('Instagram Alert text:', await instagramAlert.getText());
    await instagramAlert.accept();

    // Update YouTube link
    await youtubeInput.clear();
    await youtubeInput.sendKeys('https://youtube.com');
    await youtubeButton.click();

    // Handle the alert dialog box for YouTube
    await driver.wait(until.alertIsPresent(), 5000);
    const youtubeAlert = await driver.switchTo().alert();
    console.log('YouTube Alert text:', await youtubeAlert.getText());
    await youtubeAlert.accept();

    // Reset links to original values using originalLinksVals
    await facebookInput.clear();
    await facebookInput.sendKeys(originalLinksVals[0]);
    await facebookButton.click();

    // Handle the alert dialog box for Facebook reset
    await driver.wait(until.alertIsPresent(), 5000);
    const facebookResetAlert = await driver.switchTo().alert();
    console.log('Facebook Reset Alert text:', await facebookResetAlert.getText());
    await facebookResetAlert.accept();

    await instagramInput.clear();
    await instagramInput.sendKeys(originalLinksVals[1]);
    await instagramButton.click();

    // Handle the alert dialog box for Instagram reset
    await driver.wait(until.alertIsPresent(), 5000);
    const instagramResetAlert = await driver.switchTo().alert();
    console.log('Instagram Reset Alert text:', await instagramResetAlert.getText());
    await instagramResetAlert.accept();

    await youtubeInput.clear();
    await youtubeInput.sendKeys(originalLinksVals[2]);
    await youtubeButton.click();

    // Handle the alert dialog box for YouTube reset
    await driver.wait(until.alertIsPresent(), 5000);
    const youtubeResetAlert = await driver.switchTo().alert();
    console.log('YouTube Reset Alert text:', await youtubeResetAlert.getText());
    await youtubeResetAlert.accept();

    console.log('Social media link testing concluded. All tests passed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sleep(2000);
    await driver.quit();
  }
}

// Call the test function
testEditableContentAndSave();
