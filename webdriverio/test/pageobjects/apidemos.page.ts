export class APIDemosPage {
    // Menu Utama
    static appBtn() {
        return $('//android.widget.TextView[@content-desc="App"]');
    }

    static alertDialogsBtn() {
        return $('//android.widget.TextView[@content-desc="Alert Dialogs"]');
    }

    // Menu di dalam Alert Dialogs
    static listDialogBtn() {
        return $('//android.widget.Button[@content-desc="List dialog"]');
    }

    static textEntryDialogBtn() {
        return $('//android.widget.Button[@content-desc="Text Entry dialog"]');
    }

    // Field & Button di dalam Dialog
    static userNameField() {
        return $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/username_edit"]');
    }

    static passwordField() {
        return $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/password_edit"]');
    }

    static okBtn() {
        return $('//android.widget.Button[@resource-id="android:id/button1"]');
    }
}