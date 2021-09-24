/*
* Gets all the movies based on the title passed in the Request body
* {
*    "title":"joker"
* }
*
*/

//const API_KEY = "c292408";
const MIN_PAGE_COUNT = 10;
const resultArray = [];

const calculatePageNumber = (totalNumber) => Math.ceil(totalNumber / MIN_PAGE_COUNT);


//Get the Movie API
const getMovieAPI = async (opts, pageNumber) => {
    if (pageNumber)
        opts.parameters.page = pageNumber;

    //log.info(JSON.stringify(opts));   
    let response;
    try {
        // Send api request.
        response = await apis.s(opts);
    } catch (error) {
        log.error("Error in request: ", error);
        return fail();
    }

    return response;

}

try {
    // Send api request.
    //const incomingTitle = req.body;
    if (!req.body.title) {
        result = {
            error: "Failed to provide the title in the body",
            status: 400
        };
        return complete();
    }

    if (!req.query.apikey) {
        result = {
            error: "Failed to provide the API Key",
            status: 400
        };
        return complete();
    }
    const opts = {};
    opts.parameters = {};
    //Read the API KEY as a Parameter passed in from the request!
    opts.parameters.apikey = req.query.apikey;
    const incomingTitle = req.body;
    opts.parameters.s = incomingTitle.title;

    const firstPage = await getMovieAPI(opts);
    resultArray.push(...firstPage.data.Search);
    log.info(JSON.stringify(resultArray));

    const totalPageNumbers = calculatePageNumber(firstPage.data.totalResults);
    log.info(`Number of pages calculated ${totalPageNumbers}`);

    if (totalPageNumbers > 1) {
        for (let page = 2; page <= totalPageNumbers; page++) {
            log.info(`İterating to get pagenumber ${page}`);
            const currentData = await getMovieAPI(opts, page);
            resultArray.push(...currentData.data.Search);
        }

    }
    result = {
        TotalResults: resultArray.length,
        SearchResult: resultArray
    }

    log.info(JSON.stringify(result));

} catch (error) {
    log.error("Error in request: ", error);
    return fail();
}

complete();
