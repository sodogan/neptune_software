/*validate the input control make sure user entered a value!
//Can validate input from text,select etc..
//Will create a new record here!
//validate the records first!
valid = validate(inoSimpleFormInstructionStepID) &&
    validate(inoSimpleFormInstructionTime)&&
    validate(inoSimpleFormInstructionAction);

if (valid)... 

*/
let validate = (control) => {
    let value;
    if (control && 'getValue' in control) {
        value = control.getValue();
    }
    else if (control && 'getSelectedItem' in control) {
        value = control.getSelectedItem();
    }
    else {
        throw new Error('Control is not type of input!')
    }

    if (value > "") {
        control.setValueState(sap.ui.core.ValueState.Success);
        return true;
    }
    else {//set the state to Error
        control.setValueState(sap.ui.core.ValueState.Error);
        return false;
    }

}
//sample call will be like 
//displayError("please select a record", error)
let displayErrorMessage = (message) => {
    //User should choose an item to edit!
    if (sap.n) {
        return sap.n.Utils.message({
            title: "Search Failed",
            state: "Error",
            text1: message
        });
    }

    return sap.m.MessageBox.error(message, 
     {
        styleClass: `sapUiResponsivePadding--header 
        sapUiResponsivePadding--content 
        sapUiResponsivePadding--footer`
    });
    
}