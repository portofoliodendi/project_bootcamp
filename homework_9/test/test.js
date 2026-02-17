const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('Google Search Test', function () {
    let driver;

    before(async function () {
        console.log('ini di dalam before() hook')
        let options = new chrome.Options();
        options.addArguments('--incognito');
        //options.addArguments('--headless');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        console.log('ini di dalam after() hook')
        await driver.quit();
    });

    it('Visit SauceDemo dan Login', async function () {
        await driver.get('https://www.saucedemo.com');
        await driver.findElement(By.css('[data-test="username"]')).sendKeys('standard_user');
        await driver.findElement(By.css('[data-test="password"]')).sendKeys('secret_sauce');
        await driver.findElement(By.className('submit-button btn_action')).click();

        let buttonCart = await driver.wait(until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')), 10000);
        await driver.wait(until.elementIsVisible(buttonCart), 5000, 'Shopping cart harus tampil');
        console.log('✅ Berhasil Login');
    });

     it('Short Shopping Cart', async function () {
            let dropdownSort = await driver.findElement(By.xpath('//select[@data-test="product-sort-container"]'));
        await dropdownSort.click();
        await driver.findElement(By.xpath('//option[text()="Name (A to Z)"]')).click();
        await driver.sleep(1000);

        let itemsAZ = await driver.findElements(By.className('inventory_item_name'));
        let namesAZ = [];
        for (let item of itemsAZ) {
            namesAZ.push(await item.getText());
        }
        let expectedAZ = [...namesAZ].sort(); 
        assert.deepStrictEqual(namesAZ, expectedAZ, 'Urutan A-Z salah!');
        console.log('✅ Berhasil ubah sortir menjadi A to Z:', namesAZ[0]);


        dropdownSort = await driver.findElement(By.xpath('//select[@data-test="product-sort-container"]'));
        await dropdownSort.click();
        await driver.findElement(By.xpath('//option[text()="Name (Z to A)"]')).click();
        await driver.sleep(1000);

        let itemsZA = await driver.findElements(By.className('inventory_item_name'));
        let namesZA = [];
        for (let item of itemsZA) {
            namesZA.push(await item.getText());
        }

        let expectedZA = [...namesZA].sort().reverse();
        assert.deepStrictEqual(namesZA, expectedZA, 'Urutan Z-A salah!');
        console.log('✅ Berhasil ubah sortir menjadi Z to A:', namesZA[0]);

    });
});