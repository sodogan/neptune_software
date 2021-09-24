if (sap.n) {
     sap.n.Utils.message({
        title: "Internal Server Error",
        state: "Error",
        text1: data.responseJSON.status
    });

    //more eloborate sample code
    sap.n.Utils.message({
        // Data changed
        title: 'Data changed',
        intro: 'Confirmation needed',
        text1: 'Data has been changed. Do you want to discard',
        text2: 'changes and continue without saving?',
        state: 'Error',
        acceptText: 'Yes, continue!',
        onAccept: callback
    });
//MessageObj will be like 
//{title:"REST API Failure",state:"Error",text1:"Failed to load REST API"}
let failMessage = (MessageObj)=>{
   sap.n.Utils.message({
        title: MessageObj.title,
        state: MessageObj.state,
        text1: MessageObj.text1
    });


}

}
