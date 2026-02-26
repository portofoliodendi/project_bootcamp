import { APIDemosActions } from "../actions/apidemos.action";

const apiDemosAction = new APIDemosActions();
const fs = require('fs');
if (!fs.existsSync('./screenshots')){
    fs.mkdirSync('./screenshots');
}
let fillText: string;

describe("ApiDemos - Mobile Automation Task", async () => {
    
    before(async function() {
        // Data input yang akan digunakan
        fillText = "User Bootcamp";
    })

    beforeEach(async function() {
        // Reset aplikasi sebelum mulai biar stabil
        await driver.relaunchActiveApp();
    })

    afterEach(async function() {
        // Screenshot otomatis kalau gagal (penting buat bukti tugas)
        if (this.currentTest?.state === "failed") {
            await driver.takeScreenshot();
            await driver.saveScreenshot(`./screenshots/${this.currentTest.title}.png`);
        }
    })

    after(async function() {
        // Tutup aplikasi setelah selesai
        await driver.terminateApp('io.appium.android.apis');
    })

    it("@TC001 - Launch App and Fill Text Entry Dialog", async () => {
        // 1. Jalankan Navigasi
        await apiDemosAction.waitForAppBtn();
        await apiDemosAction.clickAppBtn();
        await apiDemosAction.clickAlertDialogsBtn();
        await apiDemosAction.clickTextEntryDialogBtn();

        // 2. Isi field Name dan Password
        await apiDemosAction.fillUserName(fillText);
        await apiDemosAction.fillPassword(fillText);

        // 3. Verifikasi (Assert) apakah value sudah sesuai
        const actualName = await apiDemosAction.getUserNameValue();
        const actualPass = await apiDemosAction.getPasswordValue();

        expect(actualName).toEqual(fillText); 
        expect(actualPass.length).toEqual(fillText.length);
        // 4. Klik OK untuk menutup dialog
        await apiDemosAction.clickOkBtn();
    });
});