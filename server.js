var logger = require('morgan'),
    cors = require('cors'),
    http = require('http'),
    express = require('express'),
    errorhandler = require('errorhandler'),
    dotenv = require('dotenv'),
    passport = require('passport'),
    bodyParser = require('body-parser');

var app = express();

dotenv.load();

/**
 * Configure express app
 */

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.use(function (err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next(err);
    }
});

app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport-init');
initPassport(passport);

if (process.env.NODE_ENV === 'development') {
    app.use(express.logger('dev'));
    app.use(errorhandler())
}

/**
 * Define APIi routes
 */

app.use('/auth', require('./api/authentication')(passport));

/**
 * Creating server on specified port.
 */

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
});