const { useState } = React;

//Componente Principal
function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    const fetchSuggestions = async (query) => {
        const apiKey = 'ecf442398977c3fe04c711c2af5ad84a';
        const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}&units=metric&lang=es`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.list) {
                setSuggestions(data.list);
                setError(null); // Limpiar el error si hay sugerencias
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    const handleSearch = async (nombreCiudad) => {
        const apiKey = 'ecf442398977c3fe04c711c2af5ad84a';
        let nombreCiudadParametro = '';

        switch (nombreCiudad) {
            case 'Tucumán':
                nombreCiudadParametro = 'San Miguel de Tucumán';
                break;
            case 'Salta':
                nombreCiudadParametro = 'Salta, Argentina';
                break;
            case 'Buenos Aires':
                nombreCiudadParametro = 'Ciudad Autónoma de Buenos Aires';
                break;
            default:
                nombreCiudadParametro = nombreCiudad;
                break;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${nombreCiudadParametro}&appid=${apiKey}&units=metric&lang=es`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Ciudad no encontrada');
            }
            const data = await response.json();
            setWeatherData(data);
            setWeatherIcon(`./contenido/${data.weather[0].icon}.svg`);
            setError(null); // Limpiar cualquier error anterior
            setSuggestions([]);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(null); // Limpiar datos anteriores si hay un error
            setError('Ciudad no encontrada');
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(`${suggestion.name}, ${suggestion.sys.country}`);
        setSuggestions([]);
        setError(null); // Limpiar cualquier error anterior
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);
        if (value.length > 2) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="Clima">
            <nav>
                <ul>
                    <li><h1 style={{ color: 'black' }}>Clima Visión</h1></li>
                </ul>
                <ul>
                    <li><a href="#" onClick={() => handleSearch('Tucumán')}>Tucumán</a></li>
                    <li><a href="#" onClick={() => handleSearch('Salta')}>Salta</a></li>
                    <li><a href="#" onClick={() => handleSearch('Buenos Aires')}>Buenos Aires</a></li>
                </ul>
            </nav>
            <form role="search" onSubmit={(e) => { e.preventDefault(); handleSearch(city); }}>
                <input
                    name="search"
                    type="search"
                    placeholder="Buscar"
                    autoComplete="off"
                    required
                    value={city}
                    onChange={handleInputChange}
                />
                <input type="submit" value="Buscar" />
            </form>
            <ul className="suggestions">
                {suggestions.map((suggestion) => (
                    <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion.name}, {suggestion.sys.country}
                    </li>
                ))}
            </ul>
            {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error */}
            {weatherData && weatherData.cod === 200 && (
                <article data-theme="light" className="card">
                    <header>
                        <h3>{weatherData.name}, {weatherData.sys.country}</h3>
                    </header>
                    <div className="weather-content">
                        <img src={weatherIcon} alt="Weather Icon" />
                    </div>
                    <footer>
                        <h4>Temperatura Actual: {weatherData.main.temp} °C</h4>
                        <p>Clima: {weatherData.weather[0].description}</p>
                        <hr />
                        <p>Mínima: {weatherData.main.temp_min} °C / Máxima: {weatherData.main.temp_max} °C</p>
                        <p>Sensación térmica: {weatherData.main.feels_like} °C</p>
                        <p>Humedad: {weatherData.main.humidity} %</p>
                        <p>Hora Actual: {new Date().toLocaleTimeString()}</p>
                        <p>Visión: {weatherData.visibility} m</p>
                        <p>Nubosidad: {weatherData.clouds.all} %</p>
                        <p>Precipitación: {weatherData.rain ? weatherData.rain['1h'] : 0} mm</p>
                    </footer>
                </article>
            )}
        </div>
    );
}