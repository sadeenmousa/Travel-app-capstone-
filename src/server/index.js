let projectData = {};

var path = require('path')

// Require Express to run server and routes
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
const bodyParser = require('body-parser')
const cors = require('cors');

// Start up an instance of app
const app = express()

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'))

console.log(__dirname)

app.use(cors());

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8088, function () {
    console.log('Example app listening on port 8088!')
})

//get routs
app.get('/all', function (req, res) {
    res.send(projectData);
});

app.post('/add', function (req, res) {
    projectData.city = req.body.city;
    projectData.countryName = req.body.countryName;
    projectData.countryCode = req.body.countryCode;
    projectData.indate = req.body.indate;
    projectData.enddate = req.body.enddate;
    projectData.duration = req.body.duration;
    projectData.Days = req.body.Days;
    projectData.low_temp = req.body.low_temp;
    projectData.max_temp = req.body.max_temp;
    projectData.picsrc = req.body.picsrc;
    projectData.picalt = req.body.picalt;
    res.send(projectData)
    console.log('test result');
    console.log(projectData);
});


app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})



module.exports = app
