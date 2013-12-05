
var urls = require('../db/url.js');
var cuid = require('cuid');
var ua = require('universal-analytics');
var argv = require('optimist').argv;
var redirectCode = !!argv.debug ? 200 : 301;

var visit = function (url, title) {
    var visitor = ua(argv.ua);
    visitor.pageview('/' + url, title, "http://28hu.it", function (err) {
        if (err) {
            console.err(err);
        }
    });
}

module.exports.index = function (req, res) {
	var content = "28hu.it v" + req.package.version + '\n';
	content += '(c) Deux Huit Huit 2014 http://deuxhuithu.it';
    res.status(200).set('Content-Type', 'text/plain').end(content);
};

module.exports.create = function (req, res) {
    var url = req.params[0];
    
    if (/^https?:\/\/28hu.it/gi.test(url)) {
        res.status(500).set('Content-Type', 'text/plain').end('No recursive links');
        return;
    }
    
    urls.create(url, function (err, result) {
        if (!!err || !result.length) {
            console.error(err);
           res.status(500).set('Content-Type', 'text/plain').end('Error');
        } else {
            res.status(200).set('Content-Type', 'text/plain').end('http://28hu.it/' + result[0].hash);
        }
    });
    //console.log('Why? ' + url);
    //res.end('Hash: ' + cuid.slug());
    
    visit('create', url);
};

module.exports.redirect = function (req, res) {
    urls.fetch(req.params.hash, function (err, result) {
       if (!!err) {
           res.status(500).set('Content-Type', 'text/plain').end('Error');
       } else if (!result || !result.length) {
           res.status(404).set('Content-Type', 'text/plain').end('Not found');
       } else {
           res.status(redirectCode).set('Content-Type', 'text/plain').set('Location', result[0].url).end(result[0].url);
           visit('redirect/' + req.params.hash, result[0].url);
       }
    });
};