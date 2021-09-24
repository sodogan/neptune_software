/*
* Gets the movie details based on the title passed in the Request body
* {
*    "imdbID":"tt7286456"
* }
*
*/

const API_KEY = "c292408";


try {

 if (!req.body.imdbID) {
        result = {
            error: "Failed to provide the imdbID in the body",
            TotalResults: 0
        };
        result.status = 400;
        return complete();

    }

    const opts = {};
    opts.parameters = {};
    opts.parameters.apikey = API_KEY;
    opts.parameters.i  = req.body.imdbID;
    // Send api request.
    const response = (await apis.i(opts)).data;
   
//The final output
    result= {
        MovieDetails:response
    }

} catch (error) {
    log.error("Error in request: ", error);
    return fail();
}

complete();