const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const session = require('express-session');


const flightSchema = new Schema(
  {
    id: Number,
    message: String,
    username: String
  },
  {
    collection: 'flights' }
  
);
const Flight = mongoose.model('Flight', flightSchema);

var userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
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
userSchema.statics.authenticate = function (email, password) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
        return;
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        console.log(err);
        return;
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          console.log("success!!!");
          return;
        } else {
          console.log(user);
          return;
        }
      })
    });
}
const User = mongoose.model('User', userSchema);



const API_PORT = 3001;
const app = express();
app.use(cors());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://guest:guest_passwd@cluster0-tw5wq.mongodb.net/flight-log?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

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
  Flight.find((err, data) => {
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

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Flight.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Flight();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


router.post("/createUser", (req, res) => {
  let data = new User();

  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.email = email;
  data.username = username;
  data.password = password;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/login", (req, res) => {
  let data = new User();

  
  data.email = req.body.email;
  
  data.password = req.body.password;
  
  User.authenticate(data.email, data.password);
});




// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));