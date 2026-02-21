const fs = require('fs');

class SharingAction {
    constructor(driver) {
        this.driver = driver;
    }

    async fullPageScreenshot(fileName) {
        const fullScreen = await this.driver.takeScreenshot();
        fs.writeFileSync('screenshot/' + fileName + '.png', fullScreen, 'base64');
    }

    async partialScreenshot(element, fileName) {
        const partial = await this.driver.findElement(element).takeScreenshot();
        fs.writeFileSync('screenshot/' + fileName + '.png', partial, 'base64');
    }
}

module.exports = SharingAction;