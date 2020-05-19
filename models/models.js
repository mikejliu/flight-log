var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var FlightSchema = new Schema(
  {
    date: String,
    airline: String,
    flight_number: String,
    from: String,
    from_lat: String,
    from_long: String,
    to: String,
    to_lat: String,
    to_long: String,
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
    flight_id: String
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

module.exports = {
  Flight: Flight,
  Image: Image,
  User: User
};
