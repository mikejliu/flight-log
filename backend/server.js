var mongoose = require("mongoose");
var express = require("express");
var cors = require('cors');
var bodyParser = require("body-parser");
var logger = require("morgan");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var fs = require("fs");
var multer = require("multer");

var FlightSchema = new Schema(
  {
    date: String,
    airline: String,
    flight_number: String,
    from: String,
    to: String,
    aircraft: String,
    reg: String,
    username: String
  },
  { collection: 'flights' }
);
var Flight = mongoose.model('Flight', FlightSchema);

var ImageSchema = new Schema(
  {
    img: {
      data: Buffer,
      contentType: String
    },
    username: String
  },
  { collection: 'images' }
);
var Image = mongoose.model('Image', ImageSchema);

var UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    airport: {
      type: String,
      required: false,
    },
    public: {
      type: Boolean,
      required: true,
    }
  },
  { collection: 'users' }
);

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          var err = new Error('Incorrect password.');
          err.status = 401;
          return callback(err);
        }
      })
    });
}
var User = mongoose.model('User', UserSchema);

var API_PORT = 3001;
var router = express.Router();
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


router.get("/getData", (req, res) => {
  Flight.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getImage", (req, res) => {
  Image.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


router.post("/updateData", (req, res) => {
  var { id, update } = req.body;
  Flight.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getCurrentAirport", (req, res) => {
  User.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/submitCurrentAirport", (req, res) => {
  var { update } = req.body;
  var username = req.session.username;
  User.findOneAndUpdate({ "username": username }, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getAirportUsers", (req, res) => {
  var { airport } = req.query;
  User.find({ "airport": airport }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getPublic", (req, res) => {
  User.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/changePublic", (req, res) => {
  var { update } = req.body;
  var username = req.session.username;
  User.findOneAndUpdate({ "username": username }, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getPublicUsers", (req, res) => {
  User.find({ "public": true }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getPublicLog", (req, res) => {
  var { username } = req.query;
  Flight.find({ 'username': username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


router.delete("/deleteData", (req, res) => {
  var { id } = req.body;
  Flight.findOneAndDelete({ "_id": id }, err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.delete("/deleteImage", (req, res) => {
  var { id } = req.body;
  Image.findOneAndDelete({ "_id": id }, err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});


router.post("/putData", (req, res) => {
  var data = new Flight();
  var { date, airline, flight_number, from, to, aircraft, reg } = req.body;
  if (!date || !airline || !flight_number || !from || !to || !aircraft || !reg) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.date = date;
  data.airline = airline;
  data.flight_number = flight_number;
  data.from = from;
  data.to = to;
  data.aircraft = aircraft;
  data.reg = reg;
  data.username = req.session.username;
  data.save((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


router.post("/createUser", (req, res) => {
  var data = new User();
  var { username, password } = req.body;
  if (!username || !password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.username = username;
  data.password = password;
  data.airport = null;
  data.public = false;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) return res.json({ success: false, error: err.message });
    req.session.username = user.username;
    return res.json({ success: true, user: user });
  });
});

router.get('/logout', function (req, res) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        return res.json({ success: true });
      }
    });
  }
});

// https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
router.post('/photo', function (req, res) {
  var newItem = new Image();
  newItem.username = req.session.username;
  var file = req.file;
  newItem.img.data = fs.readFileSync(file.path);
  newItem.img.contentType = file.mimetype;
  newItem.save((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));