const { Builder} = require('selenium-webdriver');
const LoginAction = require('../actions/login.action.js'); 
const SharingAction = require('../actions/sharing.action.js');
const LoginPage = require('../pageobjects/login.page.js');
const {compareScreenshot} = require('../../utilities/visual_regression.helper.js');

describe('Login', ()=> {
    let driver;
    let loginAction; 
    let sharingAction;

    beforeEach(async ()=>{
        driver = await new Builder().forBrowser('chrome').build();
        loginAction = new LoginAction(driver);
        sharingAction = new SharingAction(driver);
        await loginAction.openLoginPage('https://www.saucedemo.com/');
                
    })

    afterEach(async ()=>{
        await driver.quit();
    });

    it('should login with valid credentials', async () => {
       await loginAction.inputUsername('standard_user');
       await loginAction.inputPassword('secret_sauce');
       await loginAction.clickLogin();
       await loginAction.assertLoginSuccess();
       await sharingAction.fullPageScreenshot('login_success');
       await compareScreenshot(driver, 'login_success', 1);
    });

    it('should not login with invalid credentials', async () => {
        await loginAction.inputUsername('user_salah');
        await loginAction.inputPassword('password_salah');
        await loginAction.clickLogin();
        await loginAction.assertLoginFailed('Epic sadface: Username and password do not match any user in this service');
        await sharingAction.fullPageScreenshot('login_failed_invalid_credentials');
        await compareScreenshot(driver, 'login_failed_invalid_credentials', 1);
    });

    it('should not login with wrong password', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.inputPassword('wrong_password');
        await loginAction.clickLogin();
        await loginAction.assertLoginFailed('Epic sadface: Username and password do not match any user in this service');
        await sharingAction.fullPageScreenshot('login_failed_wrong_password');
        await compareScreenshot(driver, 'login_failed_wrong_password', 1);
    });

    it('should not login with locked out user', async () => {
        await loginAction.inputUsername('locked_out_user');
        await loginAction.inputPassword('secret_sauce');
        await loginAction.clickLogin();
        await loginAction.assertLoginFailed('Epic sadface: Sorry, this user has been locked out.');
        await sharingAction.fullPageScreenshot('login_failed_locked_out_user');
        await sharingAction.partialScreenshot(LoginPage.errorMessage, 'login_failed_locked_out_user_partial');
        await compareScreenshot(driver, 'login_failed_locked_out_user', 1);
        await compareScreenshot(driver, 'login_failed_locked_out_user_partial', 1);
    });
});