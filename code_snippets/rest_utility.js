class Rest_Utility {
    //display Message
    static successHandler(apiEndPoint, xhr) {
        const msg = `Successfully loaded API ${apiEndPoint}`;
        if (!xhr) {
            throw new Error('Failed in parsing the XHR response');
        }
        const response = xhr.responseJSON;

        const stringfied = JSON.stringify(response);
        console.log(`API ${apiEndPoint} response:`, stringfied);
        sap.m.MessageToast.show(msg);
    }

    static failureHandler(apiEndPoint, xhr) {
        const msg = `Failed to load API ${apiEndPoint}`;
        const response = xhr.responseJSON;

        console.error(response);
        sap.m.MessageToast.show(msg);
    }

}