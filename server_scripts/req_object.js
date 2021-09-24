//Understanding the req object!
//Parameters are passed with a where cluase
//like where = {"id":"123-3433-2322"}
const parsedBody =  req.body.templates;

result = {
    url :req.url,
    body: parsedBody,
    method: req.method,
    params: req.params,
    where: req.query,
    id: req.query.where,
    headers:req.headers
};

