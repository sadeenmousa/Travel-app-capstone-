 
// /* Global Variables */

const gemoAPI = 'http://api.geonames.org/searchJSON?q='
const gemoKEY = '&maxRows=1&username=sadeen'
const weatherbitAPI = 'http://api.weatherbit.io/v2.0/forecast/daily?'
const weatherbitKEY = '&key=703872a67f1e4abc85f082a02d19f7fe'
const PixabayAPI = 'https://pixabay.com/api/?key='
const PixabayKey = '19335241-d1fc3de44bc120ed5608efab0'

document.getElementById('generate').addEventListener('click', performAction);


 function performAction(e) {
    e.preventDefault();
    document.getElementById('location').innerHTML="";
    const location = document.getElementById('location').value
    const indate = document.getElementById('indate').value
    const enddate = document.getElementById('enddate').value
     
    //check input 
    Client.validInput(location,indate);


    // countdowan
    const currentDate = new Date();
    const StartTripDate = new Date(indate);
    const EndTripDate = new Date(enddate);
    // days to go
    const timeDifference = Math.abs(StartTripDate - currentDate);
    const Days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // trip duration
    const timdDuration = Math.abs(StartTripDate - EndTripDate);
    const duration = Math.ceil(timdDuration / (1000 * 60 * 60 * 24));

    getLocation(gemoAPI, location, gemoKEY)
        .then(data => {
            const lng = data.geonames[0].lng;
            const lat = data.geonames[0].lat;
            const city = data.geonames[0].name;
            const countryName = data.geonames[0].countryName;
            const countryCode = data.geonames[0].countryCode;

            getWeather(weatherbitAPI, lng, lat, city, weatherbitKEY)
                .then(data => {
                    for (let i in data.data) {
                        if (data.data[i].valid_date === indate)
                            var low_temp = data.data[i].low_temp;
                        var max_temp = data.data[i].max_temp;
                    }

                    getPicture(PixabayAPI, PixabayKey, city)
                        .then(data => {
                            const picsrc = data.hits[0].webformatURL;
                            const picalt = data.hits[0].tags;

                            postData('http://localhost:8088/add', { city: city, indate: indate, enddate: enddate, Days: Days, duration: duration, max_temp: max_temp, low_temp: low_temp, picsrc: picsrc, picalt: picalt, countryName: countryName, countryCode: countryCode })

                                .then(
                                    updateUI()
                                )
                        })
                })
        })

    document.getElementById('location').value = "";
    document.getElementById('indate').value = "";
    document.getElementById('enddate').value = "";

}

const getLocation = async (gemoAPI, location, gemoKEY) => {
    const res = await fetch(gemoAPI + location + gemoKEY)
    console.log(res);

    try {
        const data = await res.json();
        console.log("retrive data 1");
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

const getWeather = async (api, lat, lng, location, key) => {
    const res = await fetch(api + 'lat=' + lat + '&lon=' + lng + '&city=' + location + key)
    console.log(res);
    try {
        const data = await res.json();
        console.log("retrive data 2");
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

const getPicture = async (PixabayAPI, PixabayKey, city) => {
    const res = await fetch(PixabayAPI + PixabayKey + "&q=" + city)
    console.log(res);

    try {
        const data = await res.json();
        console.log("retrive data 3");
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        console.log("POST");
        console.log(newData);
        return newData
    } catch (error) {
        console.log("error", error);
    }
}



const updateUI = async () => {
    const request = await fetch('http://localhost:8088/all');
    try {
        const allData = await request.json();
        console.log(allData);
        document.getElementById('city').innerHTML = 'Your trip to :   ' + allData.city + ' ,' + allData.countryName + '  , ' + allData.countryCode;
        document.getElementById('startDate').innerHTML = 'Departing : ' + allData.indate;
        document.getElementById('dayToTrip').innerHTML = allData.city + ' is ' + allData.Days + '  days away ';
        document.getElementById('duration').innerHTML = 'Length of trip is :' + allData.duration + '  days ';
        document.getElementById('temp').innerHTML = ' High [  ' + allData.max_temp + '  ] ,' + ' Low [  ' + allData.low_temp + '  ]';
        // document.getElementById('tempMin').innerHTML = allData.low_temp;
        document.getElementById('pic').src = allData.picsrc;
        document.getElementById('pic').alt = allData.picalt;
        console.log('done');

    } catch (error) {
        console.log("error", error);
    }
}

export { performAction }
