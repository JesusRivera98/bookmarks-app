//const uuid = require('uuid');
const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function getBookmarkFech(title){
    let TheUrl = '/bookmark/?title=' + title;

    
    let data = {
        title : title
    }
    console.log("data", data);
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        }
    }

    let results = document.querySelector( '.results' );

    fetch( TheUrl, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML = ' '
                results.innerHTML += 
                `<div> <ul> <li> Titulo: ${responseJSON[i].title} </li> 
                    <li> Descripción: ${responseJSON[i].description} </li>
                    <li> URL: ${responseJSON[i].url} </li>
                    <li> Id: ${responseJSON[i].id} </li> 
                    <li> Rating: ${responseJSON[i].rating} </li> </div>`;
            }
            //fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function updateBookmarkFech( title, description, url, rating, id ){
    let TheUrl = '/bookmark/' + id;

    let data = {
        id: id,
        title: title,
        description: description,
        url: url,
        rating: Number(rating)
    }
    console.log(data);

    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( TheUrl, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function deleteBookmarkFech(id){
    let TheUrl = '/bookmark/' + id;

    
    let data = {
        id : id
    }
    console.log("data", data);
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        //'path variables' : data
    }

    let results = document.querySelector( '.results' );

    fetch( TheUrl, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function addBookmarkFech( title, description, url, rating ){
    let TheUrl = '/bookmarks';

    let data = {
        //id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: Number(rating)
    }
    console.log(data);

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( TheUrl, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += 
                `<div> <ul> <li> Titulo: ${responseJSON[i].title} </li> 
                    <li> Descripción: ${responseJSON[i].description} </li>
                    <li> URL: ${responseJSON[i].url} </li>
                    <li> Id: ${responseJSON[i].id} </li> 
                    <li> Rating: ${responseJSON[i].rating} </li> </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}

function watchBookmarksForm(){
    let bookmarksForm = document.querySelector( '.bookmarks-form' );

    bookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchBookmarks();
    });
}

function watchAddBookmarkForm(){
    let bookmarksForm = document.querySelector( '.add-bookmark-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        console.log("hey");
        event.preventDefault();        
        let title = document.getElementById( 'bookmarkTitle' ).value;
        let description = document.getElementById( 'bookmarkDescription' ).value;
        let url = document.getElementById( 'bookmarkUrl' ).value;
        let rating = document.getElementById( 'bookmarkRating' ).value;

        console.log('title', title);

        addBookmarkFech( title, description, url, rating);
    })
}
function watchDeleteBookmarkForm(){
    let bookmarksForm = document.querySelector( '.delete-bookmark-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();        
        let id = document.getElementById( 'bookmarkIdToDelete' ).value;
        
        deleteBookmarkFech(id);
    })
}
function watchUpdateBookmarkForm(){
    let bookmarksForm = document.querySelector( '.update-bookmark-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();        
        let title = document.getElementById( 'updateBookmarkTitle' ).value;
        let description = document.getElementById( 'updateBookmarkDescription' ).value;
        let url = document.getElementById( 'updateBookmarkUrl' ).value;
        let rating = document.getElementById( 'updateBookmarkRating' ).value;
        
        let id = document.getElementById( 'bookmarkIdToUpdate' ).value;
        
        updateBookmarkFech( title, description, url, rating, id);
    })
}
function watchGetBookmarkForm(){
    let bookmarksForm = document.querySelector( '.get-titled-bookmarks-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();        
        let title = document.getElementById( 'bookmarkTitleToGet' ).value;
        

        getBookmarkFech(title);
    })
}

function init(){
    fetchBookmarks();
    watchBookmarksForm();
    watchDeleteBookmarkForm();
    watchAddBookmarkForm();
    watchUpdateBookmarkForm();
    watchGetBookmarkForm();
}

init();