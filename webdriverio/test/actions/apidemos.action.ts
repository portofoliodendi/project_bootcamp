import { APIDemosPage } from "../pageobjects/apidemos.page";

export class APIDemosActions {
    // Fungsi untuk nunggu element muncul (biar gak kena flaky error di laptop i3)
    async waitForAppBtn() {
        await APIDemosPage.appBtn().waitForDisplayed({ timeout: 10000 });
    }

    // Navigasi
    async clickAppBtn() {
        await APIDemosPage.appBtn().click();
    }

    async clickAlertDialogsBtn() {
        await APIDemosPage.alertDialogsBtn().click();
    }

    async clickTextEntryDialogBtn() {
        await APIDemosPage.textEntryDialogBtn().click();
    }

    // Interaksi Form
    async fillUserName(name: string) {
        await APIDemosPage.userNameField().setValue(name);
    }

    async fillPassword(pass: string) {
        await APIDemosPage.passwordField().setValue(pass);
    }

    async clickOkBtn() {
        await APIDemosPage.okBtn().click();
    }

    // Fungsi untuk Verification
    async getUserNameValue() {
        return await APIDemosPage.userNameField().getText();
    }

    async getPasswordValue() {
        return await APIDemosPage.passwordField().getText();
    }
}