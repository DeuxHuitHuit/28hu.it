
/**
 * Module dependencies.
 */

var 
	pack = require('./package.json')
  , argv = require('optimist').argv
  , express = require('express')
  , ejs = require('ejs-locals')
  , routes = require('./routes') // gets index.js by default
  , path = require('path')
  , app = express(); // create the Express object

// dev only
argv.debug &&
app.configure('development', function _configureDev() {
	console.log('Mongo URI: ' + argv.db);
	console.log('Analytics ID: ' + argv.ua);
	app.use(express.logger('dev'));
	
	process.on('uncaughtException', function(err) {
      console.err('Caught exception: ' + err);
    });
});

// configure for all targets
app.configure(function _configureAll() {
  console.log('Environnment: %s', app.get('env'));
	
  // app wide vars
  app.set('ip', process.env.IP || argv.ip || 'localhost');
  app.set('port', process.env.PORT || argv.port || 3000);

  // template engine
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'html');

  // add .html to ejs
  //app.engine('.html', ejs);
    
  app.use(express.favicon());
  app.use(function setPackage(req, res, next) {
	req.package = pack;
	next();
	//console.log('Hitting my app', next);
  });
  //app.use(app.router);
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
  
  // app routes
  app.get('/', routes.index);
  app.get('/:hash', routes.redirect);
  // Do not use 'g' flag, it will make the route statefull (loop matching)
  app.get(/\/c\/(https?:\/\/.+)/i, routes.create);
});

// start the server
app.listen(app.get('port'), function _serverStarted() {
  console.log("Express server listening on " + app.get('ip') + " on port " + app.get('port'));
});
