const { Builder, By } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');
require('chromedriver');

describe('adminEventTest', function () {
  this.timeout(20000); // Set timeout for slower browsers

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  const baseURL = 'http://127.0.0.1:5500/htmla/adminEvent.html';

  it('Should Open Admin Event Page', async () => {
    await driver.get('http://127.0.0.1:5500/htmla/adminEvent.html');
    const title = await driver.getTitle();
    expect(title).to.include('Admin Event');
  });

  it('Should toggle the newsletter checkbox', async () => {
    await driver.get(baseURL);
    const toggle = await driver.findElement(By.id('newspaper_toggle'));
    const isCheckedBefore = await toggle.isSelected();
    expect(isCheckedBefore).to.be.false;
    await toggle.click();
    await driver.sleep(10000);
    const isCheckedAfter = await toggle.isSelected();
    expect(isCheckedAfter).to.be.true;
    await driver.sleep(10000);
  });
/*
  it('Should fill in and click Save Text button', async () => {
    await driver.get(baseURL);
    const textarea = await driver.findElement(By.id('info_box'));
    await textarea.clear();
    await textarea.sendKeys('Testing newsletter function!');
    const textValue = await textarea.getAttribute('value');
    expect(textValue).to.equal('Testing newsletter function!');

    const button = await driver.findElement(By.id('infoUp_button'));
    expect(button).to.exist;
    await button.click();
    await driver.sleep(10000);
  });

  it('Should upload PDF and click Send Newsletter button', async () => {
    await driver.get(baseURL);
    const fileInput = await driver.findElement(By.id('newsUp_field'));

    // Replace this with the actual path to a test PDF file on your machine
    const filePath = path.resolve('blank.pdf');
    await fileInput.sendKeys(filePath);
    const uploadedFile = await fileInput.getAttribute('value');
    expect(uploadedFile).to.include('blank.pdf');
    const button = await driver.findElement(By.id('newsSend_button'));
    expect(button).to.exist;
    await button.click();
    await driver.sleep(10000);

  });
*/
  it('Should type in SMS message and click Send SMS button', async () => {
    await driver.get(baseURL);
    const textarea = await driver.findElement(By.id('pinpoint_box'));
    await textarea.clear();
    await textarea.sendKeys('Testing SMS button!');
    const text = await textarea.getAttribute('value');
    expect(text).to.equal('Testing SMS button!');

    const button = await driver.findElement(By.id('pinpoint_sms_button'));
    await button.click();
    await driver.sleep(10000);
  });

  it('Should type in Email message and click Send Email button', async () => {
    await driver.get(baseURL);
    const textarea = await driver.findElement(By.id('pinpoint_box'));
    await textarea.clear();
    await textarea.sendKeys('Testing email button!');
    const text = await textarea.getAttribute('value');
    expect(text).to.equal('Testing email button!');

    const button = await driver.findElement(By.id('pinpoint_email_button'));
    await button.click();
    await driver.sleep(10000);
  });

  it('Should click Previous month button', async () => {
    await driver.get(baseURL);
    const button = await driver.findElement(By.xpath("//button[contains(text(),'Previous')]"));
    await button.click();
    await driver.sleep(10000);
  });

  it('Should click Next month button', async () => {
    await driver.get(baseURL);
    const button = await driver.findElement(By.xpath("//button[contains(text(),'Next')]"));
    await button.click();
    await driver.sleep(10000);
  });

  it('Should add a new event', async () => {
    await driver.get(baseURL);

    const dateInput = await driver.findElement(By.id('event-date-input'));
    const nameInput = await driver.findElement(By.id('event-name-input'));
    const timeInput = await driver.findElement(By.id('event-time-input'));
    await dateInput.sendKeys('04202025');
    await nameInput.sendKeys('Testing an event!');
    await timeInput.sendKeys('1430');
    expect(await dateInput.getAttribute('value')).to.equal('2025-04-20');
    expect(await nameInput.getAttribute('value')).to.equal('Testing an event!');
    expect(await timeInput.getAttribute('value')).to.equal('14:30');

    const button = await driver.findElement(By.id('add-button'));
    await button.click();
    await driver.sleep(10000);
  });

  it('Should delete the event', async () => {
    await driver.get(baseURL);

    const dateInput = await driver.findElement(By.id('event-date-delete'));
    const nameInput = await driver.findElement(By.id('event-name-delete'));
    await dateInput.sendKeys('04202025');
    await nameInput.sendKeys('Testing an event!');
    expect(await dateInput.getAttribute('value')).to.equal('2025-04-20');
    expect(await nameInput.getAttribute('value')).to.equal('Testing an event!');
    const button = await driver.findElement(By.id('delete-button'));
    expect(button).to.exist;
    await button.click();
    await driver.sleep(10000);
  });

});

