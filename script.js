// const api_key = "b442957534684a9cbdb182116232511";
const api_key = "3d0b7c27b3e84cfa9de110610231012";
let city_name;
let days_show;
let url, x, data_body;
let search_btn = document.getElementById("search-city-btn");
let getLocation_btn = document.getElementsByClassName("getLocation")[0];

//Fetch data
function fetch_url(url) {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data_body = dataUpdate(data);
        })
        .catch((error) => {
            toggle_classlist_loader();
            document.querySelector(".error-message").classList.toggle =
                "hidden";
            console.log(error);
        });
}

//Get location
function getLocationCoords() {
    // document.body.querySelector(".loader").classList.toggle("hidden");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                city_name =
                    position.coords.latitude + "," + position.coords.longitude;
                console.log(city_name);

                url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city_name}&days=10&aqi=yes`;
                fetch_url(url);
            },
            showError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } else {
        x = "Geolocation is not supported by this browser.";
        console.log(x);
    }
}

//Toggle error
function toggle_error() {
    if (
        !document.querySelector(".error-message").classList.contains("hidden")
    ) {
        document.querySelector(".error-message").classList.add("hidden");
    }
}

//Show error
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            x = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            x = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            x = "An unknown error occurred.";
            break;
        default:
            console.log(x);
            document.querySelector(".error-message span").textContent = x;
    }
}

//Data update
function dataUpdate(data) {
    //update location
    document.body.querySelector(
        ".location"
    ).innerHTML = `<h2>${data.location.name}, ${data.location.region}, ${data.location.country}</h2>`;

    //update current card condition
    document.body.querySelector(".condition-current span").textContent =
        data.current.condition.text;

    //update current card icon
    document.body.querySelector(
        ".condition-icon-current img"
    ).src = `images/${data.current.condition.icon.slice(35)}`;

    //update current card temp
    document.body.querySelector(".temp-today-current h3").textContent =
        data.current.temp_c + "°C";

    //update current card local time
    let localTime = (data) => {
        if (data.slice(11, 13) > 12) {
            let hour = data.slice(11, 13) - 12;
            return hour + " PM";
        } else {
            return data.slice(11, 16) + " AM";
        }
    };
    document.body.querySelector(
        ".local-time span"
    ).textContent = `Time: ${localTime(data.location.localtime)}`;

    //update current card extra info
    {
        let heading = [
            "wind_mph",
            "wind_kph",
            "wind_degree",
            "wind_dir",
            "pressure_mb",
            "pressure_in",
            "precip_mm",
            "precip_in",
            "humidity",
            "vis_km",
            "vis_miles",
        ];
        document.querySelectorAll(".data-current").forEach((element, index) => {
            element.textContent = data.current[heading[index]];
        });
        console.log(data.current.air_quality["gb-defra-index"]);
        document.querySelector(".data-current-airQ").textContent =
            data.current.air_quality["gb-defra-index"];
    }

    //update forecast
    {
        document.querySelectorAll(".day-info").forEach((element1, index) => {
            element1.querySelector(".day-date").textContent =
                data.forecast.forecastday[index].date.slice(8) +
                "-" +
                data.forecast.forecastday[index].date.slice(5, 7);
            let day_data = [
                "maxtemp_c",
                "mintemp_c",
                "maxwind_mph",
                "avghumidity",
                "daily_chance_of_rain",
            ];
            element1
                .querySelectorAll(".day-cast-data")
                .forEach((element2, index2) => {
                    element2.querySelector(".day-cast-value").textContent =
                        data.forecast.forecastday[index].day[day_data[index2]];
                });
            element1.querySelector(
                ".day-cast-data-condition"
            ).innerHTML = `<span>${
                data.forecast.forecastday[index].day.condition.text
            }</span><img src="images/${data.forecast.forecastday[
                index
            ].day.condition.icon.slice(35)}"/>`;

            // let astro_head = ;
            //update astro
            {
                element1
                    .querySelectorAll(".day-cast-astro")
                    .forEach((element3, index3) => {
                        element3.querySelector(".astro-data-day").textContent =
                            data.forecast.forecastday[index].astro[
                                ["sunrise", "sunset", "moonrise", "moonset"][
                                    index3
                                ]
                            ];
                    });
            }
        });
        toggle_classlist_loader();
        if (data_body != "updated") {
            toggle_classlist_data();
        } else {
            toggle_classlist_data();
        }

        //update hourly condition
        {
            //show temperature
            document
                .querySelectorAll(".daily-card")
                .forEach((element1, index) => {
                    element1
                        .querySelectorAll(".hour-card")
                        .forEach((element4, index4) => {
                            element4.querySelector(
                                ".hour-condition"
                            ).innerHTML = `<span>${data.forecast.forecastday[index].hour[index4].temp_c} °C</span>`;
                            console.log("reached here");
                            //change image

                            element4.querySelector(
                                ".cond-img img"
                            ).src = `images/${data.forecast.forecastday[
                                index
                            ].hour[index4].condition.icon.slice(35)}`;
                            //show chance of rain

                            element4.querySelector(
                                ".rain-percent span"
                            ).textContent =
                                data.forecast.forecastday[index].hour[index4]
                                    .chance_of_rain + "%";
                            //show time

                            let time = function () {
                                let hours = data.forecast.forecastday[
                                    index
                                ].hour[index4].time.slice(11, 13);
                                let am_pm = "am";
                                if (hours > 12) {
                                    hours -= 12;
                                    am_pm = "pm";
                                }
                                return hours + " " + am_pm;
                            };
                            element4.querySelector(".time").textContent =
                                time();
                        });
                });
        }
    }
    console.log("no Error");
    return "updated";
}

//Show hide hourly data on click
let show_hourly_forecast = document.querySelectorAll(".show-hourly img");
show_hourly_forecast.forEach((element, index) => {
    element.addEventListener("click", () => {
        element.classList.toggle("arrow-up");
        document
            .querySelectorAll(".hourly-forecast")
            [index].classList.toggle("hidden");
    });
});

//Show hide loader
let toggle_classlist_loader = () => {
    if (document.body.querySelector(".loader").classList.contains("hidden")) {
        document.body.querySelector(".loader").classList.remove("hidden");
    } else {
        document.body.querySelector(".loader").classList.add("hidden");
    }
};
//Show hide data container
let toggle_classlist_data = () => {
    if (
        document.body
            .querySelector("#container-data")
            .classList.contains("hidden")
    ) {
        document.body
            .querySelector("#container-data")
            .classList.remove("hidden");
    } else {
        document.body.querySelector("#container-data").classList.add("hidden");
    }
};

//Defining click events

//Event for location by location
getLocation_btn.onclick = () => {
    // console.log("click taken");
    toggle_classlist_loader();
    toggle_error();
    if (data_body == "updated") {
        toggle_classlist_data();
    }
    getLocationCoords();
};

//Event for location by input on enter
document.querySelector("#input-city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        toggle_classlist_loader();
        toggle_error();
        if (data_body == "updated") {
            toggle_classlist_data();
        }
        city_name = document.getElementById("input-city").value;
        url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city_name}&days=10&aqi=yes`;
        fetch_url(url);
    }
});

//Event for location by input on search
search_btn.addEventListener("click", function (e) {
    toggle_classlist_loader();
    toggle_error();
    if (data_body == "updated") {
        toggle_classlist_data();
    }
    city_name = document.getElementById("input-city").value;
    url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city_name}&days=10&aqi=yes`;
    fetch_url(url);
});
