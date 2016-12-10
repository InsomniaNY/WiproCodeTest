"use strict";
/*! rc_header_v1.js */
var rc = {};

"use strict";
/*! dc_header_v1.js */
var dc = {};

"use strict";
/*! home\home.jsx */
rc.homePageComponent = React.createClass({
    displayName: "homePageComponent",
    getInitialState: function getInitialState() {
        return {
            city: "newyork,us" 
        };
    },
    componentWillMount: function componentWillMount() {
        this.callAPI(this.state.city); 
    },
    componentDidMount: function componentDidMount() {
        var self = this;
        grandCentral.on("changecity", function (city) {
            self.callAPI(city); 
            self.setState({
                city: city 
            });
        });
    },
    callAPI: function callAPI(city) {
        var self = this;
        var successCallback = function successCallback(data) {
            dc.errMsg = null;
            dc.forecast = data; 
        };
        var failCallback = function failCallback() {
            dc.errMsg = "Failed to retrieve the Five-Day Forecast";
        };
        Forecast.getFiveDay(city, successCallback, failCallback);
    },
    changeCity: function changeCity(ev) {
        var self = this;
        var clickedCity = ev.currentTarget.getAttribute('data-tag');
        if (clickedCity !== self.state.city) {
            grandCentral.trigger("changecity", clickedCity); 
        }
    },
    render: function render() {
        var self = this;
        var cityArray = [];
        _.each(SiteConfig.cities, function (city) {
            cityArray.push(React.createElement(
                "menuitem",
                { className: "citylink", onClick: self.changeCity, "data-tag": city.var },
                city.title
            ));
        });
        var days = Forecast.getDays();
        var outputArray = [];
        var timeArray = [];
        if (dc.errMsg) {
            outputArray.push(React.createElement(
                "div",
                { id: "error" },
                "dc.errMsg"
            ));
        } else {
            var i = 0;
            _.each(days, function (day) {
                outputArray.push(React.createElement(rc.homePanel, { key: "day" + day, ref: "day" + day, day: day, totaldays: days.length, order: i }));
                i++;
            });
        }
        var timeData = Forecast.getTimes(days[2]);
        _.each(timeData, function (time) {
            timeArray.push(React.createElement(
                "div",
                { className: "timeblock" },
                React.createElement(
                    "div",
                    { className: "timestring" },
                    time
                )
            ));
        });
        return React.createElement(
            "main",
            { id: "homepage", className: "container" },
            React.createElement(
                "menu",
                { className: "cities" },
                cityArray
            ),
            React.createElement(
                "div",
                { className: "city" },
                "Five-day Forecast for " + dc.forecast.city.name + ", " + dc.forecast.city.country + "*"
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "times col-xs-1 col-sm-1" },
                    timeArray
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-10 col-sm-11" },
                    outputArray
                )
            )
        );
    }
});
rc.homePanel = React.createClass({
    displayName: "homePanel",
    render: function render() {
        var outputArray = [];
        var precip = 0;
        var dayData = Forecast.getDay(this.props.day);
        var date = Forecast.getDate(dayData);
        if (this.props.order == 0 && dayData.length < 8) {
            for (var i = 0; i < 8 - dayData.length; i++) {
                outputArray.push(React.createElement("div", { className: "timeblock" }));
            }
        }
        _.each(dayData, function (item) {
            precip = 0;
            if (item.rain && item.rain["3h"]) {
                precip += item.rain["3h"];
            }
            if (item.snow && item.snow["3h"]) {
                precip += item.snow["3h"];
            }
            precip = Math.round(precip * 100) / 100; 
            outputArray.push(React.createElement(
                "div",
                { className: "timeblock" },
                React.createElement(
                    "div",
                    { className: "temp" },
                    item.main.temp + " °F"
                ),
                React.createElement(
                    "div",
                    { className: "weather hidden-xs" },
                    React.createElement(
                        "label",
                        null,
                        "Condition: "
                    ),
                    item.weather[0].main
                ),
                React.createElement(
                    "div",
                    { className: "clouds hidden-xs" },
                    React.createElement(
                        "label",
                        null,
                        "Clouds: "
                    ),
                    item.clouds.all + "%"
                ),
                React.createElement(
                    "div",
                    { className: "humidity hidden-xs" },
                    React.createElement(
                        "label",
                        null,
                        "Humidity: "
                    ),
                    item.main.humidity + "%"
                ),
                React.createElement(
                    "div",
                    { className: "wind hidden-xs" },
                    React.createElement(
                        "label",
                        null,
                        "Wind: "
                    ),
                    Forecast.getWindDirection(item.wind.deg) + " " + item.wind.speed + "mph "
                ),
                precip > 0 ? React.createElement(
                    "div",
                    { className: "precip hidden-xs" },
                    React.createElement(
                        "label",
                        { className: "forDesktop" },
                        "Precipitation: "
                    ),
                    React.createElement(
                        "label",
                        { className: "forMobile" },
                        "Precip: "
                    ),
                    precip + "mm"
                ) : null
            ));
        });
        var bootstrapClass = "col-xs-2";
        if (this.props.totaldays == 5) {
            bootstrapClass = "col-xs-5ths"; 
        }
        return React.createElement(
            "div",
            { className: "homePanel " + bootstrapClass },
            React.createElement(
                "div",
                { className: "day" },
                React.createElement(
                    "div",
                    { className: "panelTitle" },
                    date
                ),
                React.createElement(
                    "div",
                    { className: "panelData" },
                    outputArray
                )
            )
        );
    }
});
"use strict";
/*! footer\footer.jsx */
rc.footer = React.createClass({
	displayName: "footer",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "container" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"footer",
					{ className: "col-md-12", "data-track": "footer" },
					"\xA9 2016 Andrew Resnick Designs",
					React.createElement("br", null),
					React.createElement(
						"span",
						{ className: "note" },
						"*NOTE: Dates and Times are converted to Local Time Zone"
					)
				)
			)
		);
	}
});
"use strict";
/*! header\header.jsx */
rc.header = React.createClass({
	displayName: "header",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "container" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement("div", { className: "col-md-2 col-sm-3" }),
				React.createElement(
					"header",
					{ className: "col-md-8 col-sm-6", "data-track": "header-name" },
					"Andrew Resnick"
				),
				React.createElement(
					"div",
					{ className: "col-md-2 col-sm-3" },
					React.createElement(
						"div",
						{ className: "flex" },
						React.createElement(
							"aside",
							{ className: "icons" },
							React.createElement(
								"a",
								{ className: "icon linkedin", href: "https://www.linkedin.com/in/andrew-resnick-42b23b5", target: "_blank", title: "LinkedIn", alt: "LinkedIn", "data-track": "header-linkedin" },
								React.createElement("img", { src: SiteConfig.assetsDirectory + 'images/header/linkedin.png' })
							),
							React.createElement(
								"a",
								{ className: "icon github", href: "https://github.com/InsomniaNY", target: "_blank", title: "GitHub", alt: "GitHub", "data-track": "header-github" },
								React.createElement("img", { src: SiteConfig.assetsDirectory + 'images/header/github.png' })
							)
						)
					)
				)
			)
		);
	}
});