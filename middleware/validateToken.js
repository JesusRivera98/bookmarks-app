const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateToken(req, res, next){
    //console.log(req);
    console.log(req.authorization);
    let token = req.headers.authorization;
    let book_api_key = req.headers['book-api-key'];
    let apiKey = req.query.apiKey;

    if(!token && !book_api_key && !apiKey){
        res.statusMessage = "Unauthorized, you need a key";
        return res.status(401).end()
    }
    
    if(token && token != `Bearer ${API_TOKEN}`){
        res.statusMessage = "The 'aut' token doesn't matches";
        return res.status(401).end();
    }

    if(book_api_key && book_api_key != API_TOKEN){
        res.statusMessage = "The 'book-api-key' token doesn't matches";
        return res.status(401).end();
    }

    if(apiKey && apiKey != API_TOKEN){
        res.statusMessage = "The 'apiKey' token doesn't matches";
        return res.status(401).end();
    }
    next();
}

module.exports = validateToken;