const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const fs = require("fs");
const multer = require("multer");

const flightSchema = new Schema(
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
  {collection: 'flights' }
);
const Flight = mongoose.model('Flight', flightSchema);

const imageSchema = new Schema(
  {
    img:{
      data: Buffer,
      contentType: String
    },
    username: String
  },
  {collection: 'images' }
);
const Image = mongoose.model('Image',imageSchema);

const userSchema = new Schema(
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
      type:String,
      required: false,
    },
    public:{
      type: Boolean,
      required: true,
    }
  },
  {collection: 'users' }
);

userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

userSchema.statics.authenticate = function (username, password, callback) {
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
const User = mongoose.model('User', userSchema);

const API_PORT = 3001;
const router = express.Router();
const app = express();
app.use(cors({credentials: true, origin: true}));

// this is our MongoDB database
const dbRoute = "mongodb+srv://guest:guest_passwd@cluster0-tw5wq.mongodb.net/flight-log?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);
app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename;
  },
 }).single("avatar"));

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  console.log(req.session.username);
  Flight.find({'username': req.session.username},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getImage", (req, res) => {
  Image.find({'username': req.session.username},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Flight.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getCurrentAirport", (req, res) => {
  User.find({'username': req.session.username},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/submitCurrentAirport", (req, res) => {
  const { update } = req.body;
  const username = req.session.username;
  User.findOneAndUpdate({"username":username}, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getAirportUsers", (req, res) => {
  const { airport } = req.query;
  console.log(airport);
  User.find({"airport": airport},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getPublic", (req, res) => {
  User.find({'username': req.session.username},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/changePublic", (req, res) => {
  const { update } = req.body;
  const username = req.session.username;
  User.findOneAndUpdate({"username":username}, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get("/getPublicUsers", (req, res) => {
  User.find({"public": true},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  console.log(id);
  Flight.findOneAndDelete({"_id":id}, err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.delete("/deleteImage", (req, res) => {
  const { id } = req.body;
  console.log(id);
  Image.findOneAndDelete({"_id":id}, err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Flight();

  const { date,airline,flight_number,from,to,aircraft,reg } = req.body;

  if (!date || !airline || !flight_number || !from || !to || ! aircraft || !reg) {
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
  let data = new User();
  const { username, password } = req.body;
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
  if(!req.body.username || !req.body.password){
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) return res.json({ success: false, error: err.message });
    //console.log(req);
    req.session.username = user.username;
    console.log(req.session.username);
    return res.json({ success: true, user: user });
  });
});

router.get('/logout', function(req, res) {
  if (req.session) {
    // delete session object
    console.log(req.session.username);
    req.session.destroy(function(err) {
      if(err) {
        return res.json({ success: false, error: err });
      } else {
        //console.log(req.session.username);
        return res.json({ success: true });
      }
    });
  }
});

router.post('/photo',function(req,res){
  var newItem = new Image();
  newItem.username = req.session.username;
  let file = req.file;
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