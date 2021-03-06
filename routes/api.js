var express = require('express');
var router = express.Router();
var fs = require('fs');
var { Flight, Image, User } = require('./../models/models');

function isInvalid(str) {
  return str === null || str.match(/^ *$/) !== null;
}

router.get('/getEntry', (req, res) => {
  Flight.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/addEntry', (req, res) => {
  var data = new Flight();
  var { date, airline, flight_number, from, from_lat, from_long, to, to_lat, to_long, aircraft, reg } = req.body;
  if (isInvalid(date) || isInvalid(airline) || isInvalid(flight_number) || isInvalid(from) || isInvalid(to) || isInvalid(aircraft) || isInvalid(reg)) {
    return res.json({
      success: false,
      error: 'Invalid input'
    });
  }
  data.date = date;
  data.airline = airline;
  data.flight_number = flight_number;
  data.from = from;
  data.from_lat = from_lat;
  data.from_long = from_long;
  data.to = to;
  data.to_lat = to_lat;
  data.to_long = to_long;
  data.aircraft = aircraft;
  data.reg = reg;
  data.username = req.session.username;
  data.save((err, data) => {
    if (err) return res.json({ success: false, error: 'Cannot add entry' });
    return res.json({ success: true });
  });
});

router.delete('/deleteEntry', (req, res) => {
  var { id } = req.body;
  Flight.findOneAndDelete({ '_id': id }, err => {
    if (err) return res.json({ success: false });
    Image.deleteMany({ 'flight_id': id }, err => {
      if (err) return res.json({ success: false });
      return res.json({ success: true });
    });
  });
});

router.get('/getImage', (req, res) => {
  var { flight_id } = req.query;
  Image.find({ 'flight_id': flight_id }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
router.post('/uploadImage', function (req, res) {
  var newItem = new Image();
  newItem.flight_id = req.body.flight_id;
  var file = req.file;
  if (typeof file === 'undefined') {
    return res.json({ success: false, error: 'Invalid input' });
  }
  newItem.img.data = fs.readFileSync(file.path);
  newItem.img.contentType = file.mimetype;
  newItem.save((err, data) => {
    if (err) return res.json({ success: false, error: 'Cannot upload image' });
    return res.json({ success: true, data: data });
  });
});

router.delete('/deleteImage', (req, res) => {
  var { id } = req.body;
  Image.findOneAndDelete({ '_id': id }, err => {
    if (err) return res.json({ success: false });
    return res.json({ success: true });
  });
});

router.post('/updateData', (req, res) => {
  var { id, update } = req.body;
  Flight.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get('/getCurrentAirport', (req, res) => {
  User.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/submitCurrentAirport', (req, res) => {
  var { update } = req.body;
  if (isInvalid(update.airport)) {
    return res.json({
      success: false,
      error: 'Invalid input'
    });
  }
  var username = req.session.username;
  User.findOneAndUpdate({ 'username': username }, update, err => {
    if (err) return res.json({ success: false, error: 'Cannot update current airport' });
    return res.json({ success: true });
  });
});

router.post('/leaveCurrentAirport', (req, res) => {
  var username = req.session.username;
  User.findOneAndUpdate({ 'username': username }, { airport: null }, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get('/getAirportUsers', (req, res) => {
  var { airport } = req.query;
  User.find({ 'airport': airport }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/getPublic', (req, res) => {
  User.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/changePublic', (req, res) => {
  var { update } = req.body;
  var username = req.session.username;
  User.findOneAndUpdate({ 'username': username }, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.get('/getPublicUsers', (req, res) => {
  User.find({ 'public': true }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/getPublicLog', (req, res) => {
  var { username } = req.query;
  Flight.find({ 'username': username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/createUser', (req, res) => {
  var data = new User();
  var { username, password } = req.body;
  if (isInvalid(username) || isInvalid(password)) {
    return res.json({
      success: false,
      error: 'Invalid username or password'
    });
  }
  data.username = username;
  data.password = password;
  data.airport = null;
  data.public = false;
  data.save(err => {
    if (err) {
      if (err.code === 11000) return res.json({ success: false, error: 'Username already exists' });
      return res.json({ success: false, error: 'Cannot create user' });
    }
    return res.json({ success: true });
  });
});

router.post('/login', (req, res) => {
  var { username, password } = req.body;
  if (isInvalid(username) || isInvalid(password)) {
    return res.json({
      success: false,
      error: 'Invalid username or password'
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

module.exports = router;
