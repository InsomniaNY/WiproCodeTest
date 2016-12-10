/*
    This JS Library grabs the JSON data from the API, 
    as well as provides functions to transform data into a usable format
    Called in rc.homePageComponent and rc.homePanel

    getFiveDay() requires jQuery ($.ajax), while all other functions are vanilla JS
*/
var Forecast = (function() {

	var apipath = "http://api.openweathermap.org/data/2.5/forecast?mode=json&units=imperial&appid=79bffde3f25b888d1f14d0433a03688b";

	// PUBLIC Function to make an AJAX call to the OpenWeatherMap API for the provided city
	function getFiveDay(city, successcallback, failcallback){

		$.ajax({
            url: apipath + "&q=" + city,
            async: false,
            method: "GET"
        }).done( function(data){

            successcallback(data); // send data back upon success

        }).fail(function(xhr, status, strErr){
            console.log("API call failed");
            console.log('xhr ',xhr.responseText);
            console.log('status ',status);
            console.log('strErr ',strErr);

            failcallback();
        });

	}

	// PUBLIC Function to generate an array of DAYS from the retrieved data
	function getDays(){

		var curDay = 0;
		var days = [];
		_.each(dc.forecast.list, function(day){
			var day = new Date(day.dt * 1000).getDate(); // converts the dt string and grabs only the DATE

			// If the day is different than the previously captured day, we want to store it in the days array
			if(day !== curDay){
				curDay = day;
				days.push(day);
			}
		});

		return days;
	}

	// PUBLIC Function to generate an array-of-objects containing the weather data for the specified date
	function getDay(day){
		// Use _.filter to grab just the data from the specified date
		var curList = _.filter(dc.forecast.list, function(num, index){
			var numdate = new Date(num.dt * 1000).getDate(); // converts the dt string and grabs only the DATE

			if(numdate == day){
				return num;
			}
		});
		
		return curList;
	}

	// PUBLIC Function to return the "Month Date" for the specified day as a readable string
	function getDate(day){
		var datetime = new Date(day[0].dt * 1000);
		
		// Global array "months" defined in config.js
		return date = months[datetime.getMonth()] + " " + datetime.getDate(); // Eg. Dec 12
	}

	// PUBLIC Function to convert the provided degrees into a Compass Direction
	function getWindDirection(deg){
		// Convert Degrees to Direction
		// http://stackoverflow.com/a/25867068
		var val = Math.floor((deg / 22.5) + 0.5);
		var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
		return arr[(val % 16)];
	}

	// PUBLIC Function to generate an array of TIMES from the retrieve data, since the API returns 3-hour chunks 
	function getTimes(date){
		var times = [];
		var dayData = getDay(date); // returns the third day from the original data to grab the times from
		_.each(dayData, function(day){
			var datetime = new Date(day.dt * 1000);

			var h = datetime.getHours(); // military time
	        //var min = datetime.getMinutes();
	        var dd = "A";

	        //convert hours from military time to 12-hour AM/PM time
	        if(h > 12){
	            h -= 12;
	            dd = "P";
	        }else if (h == 12){
	            dd = "P";
	        }else if (h == 0){
	            h = 12;
	        }

	        //min < 10 ? min = "0" + min.toString() : ''; // adds leading zero

	        times.push(h + dd); // Eg. 12P
		});

		return times;
	}

	// Publicly expose the necessary functions
	return {
		getFiveDay: getFiveDay,
		getDays: getDays,
		getDay: getDay,
		getDate: getDate,
		getWindDirection: getWindDirection,
		getTimes: getTimes
	};

})();