let asyncPOSTRequest = async (URL, newRec) => {
    let response = await fetch(URL, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "no-referrer",
        "body": JSON.stringify(newRec),
        "method": "PUT",
        "mode": "cors",
        "credentials": "include"
    });

    let result = await response.json();
    return result;
}
