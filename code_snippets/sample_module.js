sdc = {};
sdc.util = {};
sdc.ui = {};
sdc.ui.App = {};
sdc.ui.Dialog = {};

sdc.ui.App.config = {
    versionInfo: {
        version: "1.0.1",
        release: "Beta",
        disclaimer: "@Copyright Daimler SDC"
    },
    mode: {
    isDebugEnabled: false
    }
}

sdc.ui.App.constants= {
    templateManager: "templateManager",
    mod: "mod",
    tod: "tod",
    mim: "mim",
    e5:  "e5",
    e4:  "e4"
}

//To be used across the Dialog Mode
//if the dialog is on create mode or update mode
sdc.ui.Dialog.modes = {
    createMode: 'create',
    editMode: 'edit'
};