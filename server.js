var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var path = require('path');
var apiRouter = require('./routes/api');

var app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

var PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
