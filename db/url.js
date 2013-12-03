var db = require('./index.js');
var cuid = require('cuid');

var collectionName = 'urls';

var createHash = function () {
    return cuid.slug();
};

module.exports.create = function (url, callback) {
    db.fetch(collectionName, {url: url}, function (results) {
        if (!!results && !!results.length) {
            callback(null, results);
        } else {
            db.create(collectionName, {url: url, date: new Date(), hash: createHash()}, function (results) {
                callback(null, results);
            }, callback);
        }
    }, callback);
};

module.exports.fetch = function (hash, callback) {
    db.fetch(collectionName, {hash: hash}, function (result) {
        callback(null, result);
    }, callback);
};