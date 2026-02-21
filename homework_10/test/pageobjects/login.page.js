const { By } = require('selenium-webdriver');

class LoginPage {
    static usernameInput = By.id('user-name');
    static passwordInput = By.id('password');
    static loginButton = By.id('login-button');
    static pageTitle = By.className('title');
    static errorMessage = By.xpath('//*[@data-test="error"]');
}

module.exports = LoginPage;