/*
  Main function that triggers a phone call
  Detects if its called from browser or from the mobile device
*/
function callPhoneDialer(mUserDetails) {

  if (mUserDetails &&
      mUserDetails.hasOwnProperty('mobileNumber') &&
      mUserDetails.hasOwnProperty('firstName') &&
      mUserDetails.hasOwnProperty('lastName')) 
    {
    //get the user details
    // Trigger Call - Browser/Mobile App
    const fullName = `${mUserDetails.firstName} ${mUserDetails.lastName} `;
    const phoneNumber = mUserDetails.mobileNumber;
    const msg = `Trying to call ${fullName} on  ${phoneNumber} `;
    console.log(msg);
  
  
    //For Web side   
    if (typeof cordova === "undefined" ||
      typeof cordova.plugins === 'undefined') 
    {
      return sap.m.URLHelper.triggerTel(phoneNumber);
    }

    //For Mobile Devices 
    //enable it to be on the background
    //NPM: https://www.npmjs.com/package/cordova-plugin-advanced-background-mode
    cordova.plugins.backgroundMode.setEnabled(true);


    //NPM :https://www.npmjs.com/package/cordova-plugin-phone-call
    cordova.plugins.phonedialer.dial(
      phoneNumber,
      function (success) {
        {
          var options = {
            data: {
              "log": `Dialled ${phoneNumber} successfully!`,
              "mobileNumber": phoneNumber,
              "todName": fullName,
            }
          }
          apioRestAPICordovaLogsPUT(options);
        }
      },
      function (err) {
        var options = {};
        options.data = {};

        if (err == "empty") {
          options.data.log = "Unkown phone number";
          options.data.mobileNumber = "Unkown";
          options.data.todName = "Unknown tod name";
        }
        else {
          options.data.log = err;
          options.data.mobileNumber = phoneNumber;
          options.data.todName = fullName;
        }
        apioRestAPICordovaLogsPUT(options);
      },
      false,//onSpeakerOn,
      true,//appChooser
    );

  }
  else {
    //Error case
  }

}
/*

//NPM:https://www.npmjs.com/package/call-number
  window.plugins.CallNumber.callNumber(
     function onSuccess(success) {
        var options = {
          data: {
            "log": "Dialling Success",
          }
        }

        apioRestAPICordovaPUT(options);

     },

     function onError(err) {
      console.log(`$err`);
      var options = {
          data: {
            "log": "Dialling Failed",
          }
        }

        apioRestAPICordovaPUT(options);

     },
     phoneNumber,
     true
   );

*/

