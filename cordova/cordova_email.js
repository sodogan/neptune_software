/*
  Main function that send an email
  Detects if its called from browser or from the mobile device
  //NPM:https://www.npmjs.com/package/cordova-plugin-email
  
*/
function cordovaEmail(emailAddress) {
//  const msg = `Trying to email ${emailAddress}`;
//  console.log(msg);

// Trigger Web Browser App
  if (typeof cordova === "undefined" ||
    typeof cordova.plugins === 'undefined') {
    return sap.m.URLHelper.triggerEmail(emailAddress);
  }

// Trigger Device via Cordova
  //enable it to be on the background
  //NPM: https://www.npmjs.com/package/cordova-plugin-advanced-background-mode
  cordova.plugins.backgroundMode.setEnabled(true);

  //NPM:https://www.npmjs.com/package/cordova-plugin-email
  cordova.plugins.email.open({
    to: emailAddress,
    body: 'Hi,'
  });


}
