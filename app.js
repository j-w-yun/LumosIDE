let express = require('express');
let path = require('path');
let logger = require('morgan');
let create_error = require('http-errors');
let cookie_parser = require('cookie-parser');
let express_session = require('express-session');
let mysql_store = require('express-mysql-session')(express_session);


function get_options() {
	return {
		environment: 'development',
		
	};
}

function initialize() {
	let options = get_options();

	// Setup app
	let app = express();
	app.set('env', options.environment);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'pug');

	// Use middleware
	if (app.get('env') === 'development')
		app.use(logger('dev'));
	else if (app.get('env') === 'production')
		app.use(logger('common'));
	app.use(express.json());
	app.use(express.urlencoded({extended: false}));
	app.use(cookie_parser());
	app.use(express.static(path.join(__dirname, 'public')));

	// let session_store = create_mysql_store(options.mysql);
	// let session = create_session(session_store, options.session);
	// app.use(session);

	// Page routes
	app.use('/', require('./routes/index'));
	app.use('/users', require('./routes/users'));

	// Handle errors
	app.use(on_not_found);
	app.use(on_error);

	return app;
}

function create_mysql_store(mysql_options) {
	return new mysql_store(mysql_options);
}

function create_session(session_store, session_options) {
	session_options['store'] = session_store;
	return express_session(session_options);
}

function on_not_found(req, res, next) {
	next(create_error(404));
}

function on_error(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
}

module.exports = initialize();
