const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const validateToken = require('./middleware/validateToken');

const mongoose = require('mongoose');
const { Bookmarks } = require('./models/bookmarksModel');
const {DATABASE_URL, PORT} = require('./config');
const cors = require('./middleware/cors');

const uuid = require('uuid');

const app = express();
const jsonParser = bodyParser.json();

//const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653.";

app.use(cors);
app.use(express.static("public"));
app.use(morgan('dev'));

function middleware(req, res, next) {
    console.log("Inside the middleware");

    req.test = {};
    req.test = {
        message: "This was added inside the middleware"
    }

    next();
}

/*function validateToken(req, res, next){
    let token = req.headers.authorization;

    if(!token){
        res.statusMessage = "You must send the 'authorization' token";
        return res.status(401).end()
    }
    console.log(token);
    console.log(API_TOKEN);

    if(token != `Bearer ${API_TOKEN}`){
        res.statusMessage = "The 'aut' token doesn't matches";
        return res.status(401).end();
    }
    next();
}*/

app.use(validateToken);

/*const bookmark = {
    id: uuid.v4(),
    title: string,
    description: string,
    url: string,
    rating: number
}*/
let bookmarksList = [
    {
        id: uuid.v4(),
        title: "Google",
        description: "El buscador con el mejor algoritmo",
        url: "www.google.com",
        rating: 5
    },
    {
        id: uuid.v4(),
        title: "Facebook",
        description: "La red social más utilizada",
        url: "www.facebook.com",
        rating: 5
    }
];

//Get all bookmarks
app.get('/bookmarks', middleware, (req, res) => {
    console.log("Getting the list of bookmarks.");
    //console.log(req.test);

    //console.log(req.headers);
    Bookmarks
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })

    //return res.status(200).json(bookmarksList);
});

//Get bookmark by title
app.get('/bookmark', (req, res) => {
    console.log("Getting bookmark by title, ");
    console.log("query is :", req);

    let title = req.query.title;

    if (!title) {
        res.statusMessage = "The parameter 'title' is required.";
        return res.status(406).end();
    }

    Bookmarks
        .getBookmarkBytitle(title)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })

    /*console.log(req.query);

    let title = req.query.title;

    if (!title) {
        res.statusMessage = "The parameter 'title' is required.";
        return res.status(406).end();
    }

    let result = bookmarksList.find((bookmark) => {
        if (bookmark.title == title) {
            return bookmark;
        }
    })

    if (!result) {
        res.statusMessage = `That 'title'=${title} is not found in the list`;
        return res.status(404).end();
    }

    return res.status(200).json(result);*/
});


//Bookmark new bookmark
app.post('/bookmarks', jsonParser, (req, res) => {
    console.log('adding a bookmark')
    //console.log(req);
    //console.log('body', req.body);
    //console.log(req.headers['application/x-www-form-urlencoded']);
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    //console.log(title, description, url, rating)

    if (!title || !description || !url || !rating) {
        res.statusMessage = "All parameters: 'title', 'description', 'url' and 'rating' must be sent in the body.";
        return res.status(406).end();
    }

    if (typeof (rating) !== 'number') {
        res.statusMessage = "The 'rating' must be a number.";
        return res.status(409).end();
    }

    let flag = true;

    /*for (let i = 0; i < bookmarksList.length; i++) {
        if (bookmarksList[i].id === id) {
            flag = !flag;
            break;
        }
    }*/

    /*if (!flag) {
        res.statusMessage = "The 'id sent is already on the stundent list.";
        return res.status(406).end();
    }
    else {*/
    let newBookmark = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: rating
    };
    console.log(newBookmark);

    Bookmarks
        .createBookmark(newBookmark)
        .then(result => {
            if (result.errmsg) {
                res.statusMessage = "The id of that bookmark already exists in the database." +
                    result.errmsg;
                return res.status(409).end();
            }
            console.log(result);
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        });

    //bookmarksList.push(newBookmark);
    //return res.status(201).json({});
    //}
});

//Delete a bookmark
app.delete('/bookmark/:id', (req, res) => {
    console.log('Deleting bookmark');    
    //console.log("req: \n", req);
    let id = req.params.id;
    //f1724b45-e9f8-4d7c-aca4-2f5d8d67b69f
    if (!id) {
        res.statusMessage = "The 'id' must be sent as parameter in the query string.";
        return res.status(406).end();
    }

    Bookmarks
        .deleteBookmarById(id)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })

    /*

    //console.log(typeof(id));
    let bookmarkToRemove = bookmarksList.findIndex((bookmark) => {
        if (bookmark.id === id) {
            return true;
        }
    });

    if (bookmarkToRemove < 0) {
        res.statusMessage = "The 'id' was not found in the list of bookmarks.";
        return res.status(404).end();
    }

    bookmarksList.splice(bookmarkToRemove, 1);

    return res.status(200).json({});*/
});

//Patch a bookmark
app.patch('/bookmark/:id', jsonParser, (req, res) => {
    console.log("Patching bookmark by id, ");

    let pId = req.params.id
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    console.log("pid", pId, "id", id);

    if (!id) {
        res.statusMessage = "The 'id' must be sent in the body.";
        return res.status(406).end();
    }

    if (title) {
        Bookmarks
            .updateBookmarkTitle(id, title)
            .then(result => {
                //return res.status( 200 ).json( result );
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the Database. Try again later.";
                return res.status(500).end();
            })
    }
    if (description) {

        console.log("e   l ", id, "updattinf description", description);
        Bookmarks
            .updateBookmarkDescription(id, description)
            .then(result => {
                //return res.status( 200 ).json( result );
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the Database. Try again later.";
                return res.status(500).end();
            })
    }
    if (url) {
        Bookmarks
            .updateBookmarkUrl(id, url)
            .then(result => {
                //return res.status( 200 ).json( result );
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the Database. Try again later.";
                return res.status(500).end();
            })
    }
    if (rating) {
        Bookmarks
            .updateBookmarkRating(id, rating)
            .then(result => {
                //return res.status( 200 ).json( result );
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the Database. Try again later.";
                return res.status(500).end();
            })
    }

    Bookmarks
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })


    /*

    let result = bookmarksList.find((bookmark) => {
        if (bookmark.id == id) {
            if (title) {
                bookmark.title = title;
            }
            if (description) {
                bookmark.description = description;
            }
            if (url) {
                bookmark.url = url;
            }
            return bookmark;
        }
    })

    if (!result) {
        res.statusMessage = `That 'id'=${id} is not found in the list`;
        return res.status(404).end();
    }

    return res.status(200).json(result);
    */
});

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});

//http://localhost:8080

//http://localhost:8080/api/bookmarks

//http://localhost:8080/api/bookmarkById?=123

//http://localhost:8080/api/getbookmarkById/:123