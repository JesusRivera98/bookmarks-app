const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
    id: {
        type: String,
        //type: uuid.v4(),
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }

});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
    createBookmark: function (newBookmark) {
        return bookmarksCollection
            .create(newBookmark)
            .then(createdBookmark => {
                return createdBookmark;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getAllBookmarks: function () {
        return bookmarksCollection
            .find()
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    getBookmarkBytitle: function (title) {
        return bookmarksCollection
            .find({ title: title })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    deleteBookmarById: function (id) {
        return bookmarksCollection
            .deleteOne({ id: id }, function (err) {
                if (err) return handleError(err);
                // deleted at most one tank document
            });
        //bookmarksCollection.save();
        return bookmarksCollection
            .find()
            .then(allBookmarks => {
                return allBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    patchBookmarkById: function (id) {
        return bookmarksCollection
            .updateOne({ id: id }, values)
        //bookmarksCollection.save();
        return bookmarksCollection
            .find({ id: id })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmarkTitle: function (id, value) {
        return bookmarksCollection
            .updateOne({ id: id }, { title: value })

        //bookmarksCollection.save();

        return bookmarksCollection
            .find({ id: id })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmarkDescription: function (id, value) {
        return bookmarksCollection
            .updateOne({ id: id }, { description: value })

        //bookmarksCollection.save();

        return bookmarksCollection
            .find({ id: id })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmarkUrl: function (id, value) {
        return bookmarksCollection
            .updateOne({ id: id }, { url: value })

        //bookmarksCollection.save();

        return bookmarksCollection
            .find({ id: id })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmarkRating: function (id, value) {
        return bookmarksCollection
            .updateOne({ id: id }, { rating: value })

        //bookmarksCollection.save();

        return bookmarksCollection
            .find({ id: id })
            .then(titledBookmarks => {
                return titledBookmarks;
            })
            .catch(err => {
                return err;
            });
    }
}

module.exports = { Bookmarks };