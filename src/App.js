import "./App.css";
import React from "react";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: "Madrid",
      isLoading: false,
      displayLocation: "",
      weather: {},
    };
    this.handleLocationField = this.handleLocationField.bind(this);
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  handleLocationField(e) {
    this.setState(() => {
      return { location: e.target.value };
    });
  }

  async fetchWeather() {
    try {
      this.setState({ isLoading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
      this.setState({ isLoading: false });
    } catch (err) {
      console.err(err);
    }
  }
  render() {
    return (
      <>
        <div className="app">
          <h1>Classy Weather</h1>
          {!this.state.isLoading && (
            <div>
              <input
                value={this.state.location}
                type="text"
                placeholder="Search from Location.."
                onChange={this.handleLocationField}
              />
            </div>
          )}
          <button onClick={this.fetchWeather}>Get Weather</button>

          {this.state.isLoading && <p className="loader">Loading ...</p>}
          {this.state.weather.weathercode && this.state.displayLocation && (
            <Weather
              weather={this.state.weather}
              location={this.state.displayLocation}
            />
          )}
        </div>
      </>
    );
  }
}
export default App;

class Weather extends React.Component {
  render() {
    console.log(this.props.weather);
    console.log(this.props.location);
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;

    return (
      <div>
        <h2>Weather in {this.props.location}</h2>
        <ul className="weather">
          {dates.map((currentData) => {
            return <li key={currentData}>{currentData}</li>;
          })}
        </ul>
      </div>
    );
  }
}
