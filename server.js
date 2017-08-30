var logger = require('morgan'),
    cors = require('cors'),
    http = require('http'),
    express = require('express'),
    errorhandler = require('errorhandler'),
    dotenv = require('dotenv'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    config = require('./common/config'),
    ExpressBrute = require('express-brute');
bodyParser = require('body-parser');

var app = express();

dotenv.load();

/**
 * Configure express app
 */

app.use(bodyParser.urlencoded({ extended: true }));
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
 * Define API routes
 */

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store, {
    minWait: 1000 * 60 * 10,
    failCallback: (req, res, next, nextValidRequestDate) => {
        res.send("Please try again at " + nextValidRequestDate);
    }
});
// Prevent brute-force on authentication api
app.use('/auth', bruteforce.prevent, require('./api/authentication')(passport));

// Prevent unauthorized calls using Bearer 
app.use(passport.authenticate('bearer', { session: false }));

// All routes should be defined below to protect any call without authentication
app.use('/sample1', require('./api/sample1'));
app.use('/sample2', require('./api/sample2'));
app.use('/sample3', require('./api/sample3'));

app.get('/test', (req, res) => {
    res.send('aaa');
})


/**
 * Creating server on specified port.
 */

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
    console.log('listening in http://localhost:' + port);
});

/**
 * Database Connect
 */

var dbUri = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;
mongoose.Promise = global.Promise;

var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutcdMS: 30000 } }
};

var db = mongoose.connect(dbUri, options);
mongoose.connection.on('open', () => {
  console.log('Database connected...');
})