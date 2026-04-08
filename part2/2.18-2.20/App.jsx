import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({ capital }) => {
  console.log('api key:', import.meta.env.VITE_SOME_KEY)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!capital) {
      return
    }

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: api_key,
          units: 'metric'
        }
      })
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('获取天气失败', error)
      })
  }, [capital])

  if (!weather) {
    return <div>正在加载天气中...</div>
  }

  const icon = weather.weather[0].icon
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>temperature {weather.main.temp} Celsius</div>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

const Filter = ({ searchTerm, handleSearchChange }) => (
    <div>
      find countries <input value={searchTerm} onChange={handleSearchChange} />
    </div>
)

const Country = ({ country }) => {
  const languages = Object.values(country.languages)
  const capital = country.capital ? country.capital[0] : ''

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital ? country.capital[0] : 'unknown'}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />

      {capital && <Weather capital={capital}/>}
    </div>
  )
}

const Countries = ({ countriesToShow, handleShowCountry }) => {
  return (
    <div>
      {countriesToShow.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShowCountry(country.name.common)}>
            show
          </button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleShowCountry = (countryName) => {
    setSearchTerm(countryName)
  }

  const countriesToShow = searchTerm === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div>
      <Filter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      {countriesToShow.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}

      {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
        <Countries
          countriesToShow={countriesToShow}
          handleShowCountry={handleShowCountry}
        />
      )}

      {countriesToShow.length === 1 && (
        <Country country={countriesToShow[0]} />
      )}
    </div>
  )
}

export default App