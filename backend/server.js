var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var apiRouter = require('./routes/api');

var app = express();

var dbRoute = 'mongodb+srv://guest:guest_passwd@cluster0-tw5wq.mongodb.net/flight-log?retryWrites=true';
mongoose.connect(dbRoute, { useNewUrlParser: true });
var db = mongoose.connection;
db.once('open', () => console.log('Connected to database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));

app.use(cors({ credentials: true, origin: true }));

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
}).single('avatar'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', apiRouter);

var API_PORT = 3001;
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
