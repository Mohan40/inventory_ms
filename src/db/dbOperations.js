const mongoose = require("mongoose");

const dbSave = (document) => {
    return document.save()
}

const dbFind = (collection, filter) => {
    return collection.find(filter).exec()
}

const dbUpdate = (collection, filter, update) => {
    return collection.findOneAndUpdate(filter, update, { useFindAndModify: false, runValidators : true }, (document, err) => {      
    }).exec()
}

const dbDelete = (collection, filter) => {
    return collection.findOneAndDelete(filter).exec()
}

module.exports = { dbSave, dbFind, dbUpdate, dbDelete }