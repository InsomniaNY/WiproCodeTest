rc.homePageComponent = React.createClass({
   getInitialState:function(){
        return {
            city: "newyork,us" // default city of NY
        }
    },
    componentWillMount:function(){
        this.callAPI(this.state.city); // call the API before the component mounts so we get some data
    },
    componentDidMount:function(){
        var self = this;

        // Listener for when a user chooses a new city; called in changeCity function
        grandCentral.on("changecity", function(city){
            self.callAPI(city); // call API with new city

            self.setState({ 
                city: city // setting the state causes the component to refresh with the new data
            });
        });
    },

    // Function to retrieve the data from the API, called in componentWillMount and componentDidMount
    callAPI:function(city){
        var self = this;

        var successCallback = function(data){
            //console.log(data);
            dc.errMsg = null;
            dc.forecast = data; // upon success, save the data to the 'dc' global object
        };

        var failCallback = function() {
            dc.errMsg = "Failed to retrieve the Five-Day Forecast";
        };

        // Call the getFiveDay function in the Forecast JS Library to grab the data via an AJAX call
        Forecast.getFiveDay(
            city,
            successCallback,
            failCallback
        );
    },
    changeCity:function(ev){
        var self = this;

        var clickedCity = ev.currentTarget.getAttribute('data-tag');

        // If the city clicked is different than the current city, let's trigger a call for the new data
        if(clickedCity !== self.state.city){
            grandCentral.trigger("changecity", clickedCity); // listener in componentDidMount
        }
        
    },
    render:function(){
        var self = this;

        // Create the menu of cities by grabbing them from SiteConfig.cities, defined in config.js
        var cityArray = [];
        _.each(SiteConfig.cities, function(city){
            cityArray.push(
                <menuitem className="citylink" onClick={self.changeCity} data-tag={city.var}>{city.title}</menuitem>
            );
        });

        // Call the getDays function in the Forecast JS Library to grab an array of days found in the data
        var days = Forecast.getDays();
        
        var outputArray = [];
        var timeArray = [];

        if(dc.errMsg){
            outputArray.push(
                <div id="error">dc.errMsg</div>
            );
        }else{
            var i = 0;

            // For each day, add a rc.homePanel component
            _.each(days, function(day){
                outputArray.push(
                    <rc.homePanel key={"day"+day} ref={"day"+day} day={day} totaldays={days.length} order={i} />
                );
                i++;
            });
        }

        // Call the getTimes function in the Forecast JS Library to grab an array of times to display in the left-hand column
        // We use days[2] to grab the times because the first entry (days[0]) may be a shortened list depending on the time of day retrieved
        // days[2] ensures we receive all eight times
        var timeData = Forecast.getTimes(days[2]);

        // For each time, create a new timeblock div for the left-hand column
        _.each(timeData, function(time){
            timeArray.push(
                <div className="timeblock">
                    <div className="timestring">{time}</div>
                </div>
            );
        });
        
        return (

            <main id="homepage" className="container">
                <menu className="cities">{cityArray}</menu>
                <div className="city">{"Five-day Forecast for " + dc.forecast.city.name + ", " + dc.forecast.city.country + "*"}</div>
                <div className="row">
                    <div className="times col-xs-1 col-sm-1">{timeArray}</div>
                    <div className="col-xs-10 col-sm-11">{outputArray}</div>
                </div>
            </main>

        );
    }
});

/*
    This React Component is called from rc.homePageComponent
    I would normally put this in a separate file, but for your own ease of readability, I'm including it here
*/
rc.homePanel = React.createClass({
    render:function(){

        var outputArray = [];
        var precip = 0;

        // Call the getDay function in the Forecast JS Library to grab just the data for the specified day
        var dayData = Forecast.getDay(this.props.day);
        //Call the getDate function in the Forecast JS Library to grab a "Month Date" string for display purposes
        var date = Forecast.getDate(dayData);

        // Depending on the time of day the API is called, the first day's data may not start with the first 3-hour block
        // As such, for the first day, if the length of the array is less than 8, insert the relevant number of empty timeblock divs first
        if(this.props.order == 0 && dayData.length < 8){
            for (var i = 0; i < (8-dayData.length); i++) {
                outputArray.push(
                    <div className="timeblock"></div>
                );
            }
        }
       
       // Now we want to cycle through each item in the dayData array to create our timeblock div with all relevant data
        _.each(dayData, function(item){

            precip = 0;
            // If there is rain and/or snow, let's add them together and provide a "Precipitation" total
            if(item.rain && item.rain["3h"]){
                precip += item.rain["3h"];
            }
            if(item.snow && item.snow["3h"]){
                precip += item.snow["3h"];
            }
            precip = Math.round(precip*100)/100; // Force a max of two decimal places

            // Inside the block below, we call the getWindDirection function in the Forecast JS library to convert degrees to a compass direction
            // For PHONES, only display Temperature
            outputArray.push(
                <div className="timeblock">
                    <div className="temp">{item.main.temp + " °F"}</div>
                    <div className="weather hidden-xs"><label>Condition: </label>{item.weather[0].main}</div>
                    <div className="clouds hidden-xs"><label>Clouds: </label>{item.clouds.all + "%"}</div>
                    <div className="humidity hidden-xs"><label>Humidity: </label>{item.main.humidity + "%"}</div>
                    <div className="wind hidden-xs"><label>Wind: </label>{Forecast.getWindDirection(item.wind.deg) + " " + item.wind.speed + "mph "}</div>
                    {/* Only display Precipitation if it's greater than 0 */}
                    {precip > 0 ? 
                        <div className="precip hidden-xs">
                            <label className="forDesktop">Precipitation: </label>
                            <label className="forMobile">Precip: </label>
                            {precip + "mm"}
                        </div> : null}
                </div>
            );
        });

        // Depending on the time of day the API is called, we can retrieve 5 or 6 days, so adjust the Bootstrap class accordingly
        var bootstrapClass = "col-xs-2";
        if(this.props.totaldays == 5){
            bootstrapClass = "col-xs-5ths"; // Custom Bootstrap class created in structure.scss
        }

        return (

            <div className={"homePanel " + bootstrapClass}>
                <div className="day">
                    <div className="panelTitle">
                        {date}
                    </div>
                    <div className="panelData">
                        {outputArray}
                    </div>
                </div>

            </div>

        );
    }
});