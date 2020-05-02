const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const jsonParser = bodyParser.json();
const app = express();
//const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653.";
const validateToken = require('./middleware/validateToken');

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

/*const post = {
    id: uuid.v4(),
    title: string,
    description: string,
    url: string,
    rating: number
}*/
let postsList = [
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

    return res.status(200).json(postsList);
});

//Get bookmark by title
app.get('/bookmark', (req, res) => {
    console.log("Getting bookmark by title, ");

    console.log(req.query);

    let title = req.query.title;

    if (!title) {
        res.statusMessage = "The parameter 'title' is required.";
        return res.status(406).end();
    }

    let result = postsList.find((bookmark) => {
        if (bookmark.title == title) {
            return bookmark;
        }
    })

    if (!result) {
        res.statusMessage = `That 'title'=${title} is not found in the list`;
        return res.status(404).end();
    }

    return res.status(200).json(result);
});


//Post new bookmark
app.post('/bookmarks', jsonParser, (req, res) => {

    console.log(req);
    console.log('body', req.body);
    console.log(req.headers['application/x-www-form-urlencoded']);
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

    /*for (let i = 0; i < postsList.length; i++) {
        if (postsList[i].id === id) {
            flag = !flag;
            break;
        }
    }*/

    /*if (!flag) {
        res.statusMessage = "The 'id sent is already on the stundent list.";
        return res.status(406).end();
    }
    else {*/
        let newPost = {
            id : uuid.v4(),
            title : title,
            description : description,
            url : url,
            rating : rating
        };

        postsList.push(newPost);
        return res.status(201).json({});
    //}
});

//Delete a bookmark
app.delete('/bookmark/:id', (req, res) => {
    let id = req.query.id;

    if (!id) {
        res.statusMessage = "The 'id' must be sent as parameter in the query string.";
        return res.status(406).end();
    }

    //console.log(typeof(id));
    let bookmarkToRemove = postsList.findIndex((bookmark) => {
        if (bookmark.id === id) {
            return true;
        }
    });

    if (bookmarkToRemove < 0) {
        res.statusMessage = "The 'id' was not found in the list of bookmarks.";
        return res.status(404).end();
    }

    postsList.splice(bookmarkToRemove, 1);

    return res.status(200).json({});
});

//Patch a bookmark
app.patch('/bookmark/:id', jsonParser, (req, res) => {
    console.log("Getting bookmark by id, ");

    console.log("body", req.body);
    console.log("params", req.params);
    console.log("path", req.path);

    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if (!id) {
        res.statusMessage = "The 'id' must be sent in the body.";
        return res.status(406).end();
    }

    let result = postsList.find((bookmark) => {
        if (bookmark.id == id) {
            if(title){
                bookmark.title = title;
            }
            if(description){
                bookmark.description = description;
            }
            if(url){
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
});

app.listen(8080, () => {
    console.log("This server is running in port 8080.");
});

//http://localhost:8080

//http://localhost:8080/api/bookmarks

//http://localhost:8080/api/bookmarkById?=123

//http://localhost:8080/api/getbookmarkById/:123