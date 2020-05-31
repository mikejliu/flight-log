# Flight Log

A digital flight log for all the AvGeeks. Users can add flight entries, upload images, view flight history on a map, share their flight log with others, and see list of users near them at an airport.

## Demo

Demo is available [here](https://dry-mountain-16931.herokuapp.com/).

Please feel free to use this demo account: 

```bash
username: user1
password: pwd1
```

## Run Locally

Make sure you have installed Node.js and npm. Then run the following commands:

```bash
$ git clone https://github.com/mikejliu/flight-log.git
$ cd flight-log && npm install
$ cd client && npm install && npm run build
$ cd .. && npm start
```

Then go to http://localhost:3001/.

Note: Path map feature is not available locally. Please use the demo above.

## Future Improvements

- [x] Autocomplete/dropdown for airport, airline and aircraft type
- [x] Get current airport from user's location
- [x] Static path map with zoom options
- [ ] Improve mobile-friendliness
- [ ] Frontend and API testing

## Acknowledgement

The Airport, Airline and Plane Databases are developed by [OpenFlights](https://openflights.org/data.html). The databases are adapted and made available under the [Open Database License](http://opendatacommons.org/licenses/odbl/1.0/). Any rights in individual contents of the databases are licensed under the [Database Contents License](http://opendatacommons.org/licenses/dbcl/1.0/).
