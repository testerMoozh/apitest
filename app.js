var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cons = require('consolidate');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/jokes/random', (req, res) => {
    request(
        { url: 'https://joke-api-strict-cors.appspot.com/jokes/random' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: err.message });
            }

            res.json(JSON.parse(body));
        }
    )
});

app.get('/admin', function (req, res) {
    res.render('admin');
});

app.get('/submitYourData', function (req, res) {
    res.render('submitYourData');
});

app.get('/submit', function (req, res) {
    res.render('submit');
});

app.get('/apitest', function (req, res) {
    res.render('apitest');
});

app.get('/jsonSchema', function (req, res) {
    res.render('jsonSchema');
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

