var express = require('express');
var router = express.Router();
var fs = require('fs');
var { Flight, Image, User } = require('./../models/models');

router.get('/getEntry', (req, res) => {
  Flight.find({ 'username': req.session.username }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post('/addEntry', (req, res) => {
  var data = new Flight();
  var { date, airline, flight_number, from, to, aircraft, reg } = req.body;
  if (!date || !airline || !flight_number || !from || !to || !aircraft || !reg) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
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
  newItem.img.data = fs.readFileSync(file.path);
  newItem.img.contentType = file.mimetype;
  newItem.save((err, data) => {
    if (err) return res.json({ success: false, error: err });
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
  var username = req.session.username;
  User.findOneAndUpdate({ 'username': username }, update, err => {
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
  if (!username || !password) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
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

router.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
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