var mongoose = require("mongoose");
var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var logger = require("morgan");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require("multer");
var apiRouter = require('./routes/api');

var API_PORT = 3001;
var app = express();
app.use(cors({ credentials: true, origin: true }));

/**
 * Set up mongoose connection
 */
var dbRoute = 'mongodb+srv://guest:guest_passwd@cluster0-tw5wq.mongodb.net/flight-log?retryWrites=true';
mongoose.connect(dbRoute, { useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', () => console.log('Connected to database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: db })
}));

app.use(multer({
  dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename;
  },
}).single("avatar"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// append /api for our http requests
app.use("/api", apiRouter);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));