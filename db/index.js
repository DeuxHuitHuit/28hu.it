/* DB Access Layer */

var 
_ = require('underscore'),
argv = require('optimist').argv,
MongoClient = require('mongodb').MongoClient,

isDBConnected = false,
database = null,

_handleError = function (err, error) {
	if (_.isFunction(error)) {
		error(err);
	}
	return console.dir(err);
},

_assureConnection = function (callback, error) {
	if (!isDBConnected) {
		// Connect to the db
		MongoClient.connect(argv.db, {auto_reconnect:true}, function(err, db) {
			if (err) { return _handleError(err, error); }
			
			isDBConnected = true;
			callback(database = db);
		});
	} else {
		callback(database);
	}
};

exports.create = function (collectionName, doc, callback, error) {
	_assureConnection(function _create(db) {
		db.collection(collectionName).insert(doc, function (err, result) {
			if (err) { return _handleError(err, error); }
			
			callback(result);
		});
	});
};
	
exports.fetch = function (collectionName, filter, callback, error) {
	_assureConnection(function _find(db) {
		db.collection(collectionName).find(filter).toArray(function (err, result) {
			if (err) { return _handleError(err, error); }
			
			callback(result);
		});
	});
};
