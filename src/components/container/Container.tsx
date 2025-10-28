/*Adicionei a API e as funcionalidades usadas na aplicação aqui no container*/

import { useState } from "react";
import "./Container.css";

/* Usei aqui uma interface para declarar as variáveis que serão utilizadas na API*/
interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

const Container = () => {

  /*Estados para receber o valor de cidade e mostrar o resultado*/
  const [city, setCity] = useState("");

  /*Estados para receber o valor do clima e atualiza o resultado*/
  const [weather, setWeather] = useState<WeatherData | null>(null);

  /*Estados para verificar se houve erro e dar resposta*/
  const [error, setError] = useState(false);

  /*Essa é a minha chave de API gerada pela OpenWeather*/
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

  /*Se houver erro, retorna o erro. Se não houver erro, ele busca o valor digitado pelo usuário, consulta a API e
  insere os valores nos estados*/
  const fetchWeather = async () => {
    if (!city) return;
    setError(false);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!res.ok) {
        setError(true);
        setWeather(null);
        return;
      }

      const data = await res.json();
      setWeather(data);
    } catch {
      setError(true);
    }
  };

  /*Verifica como é o clima da cidade buscada para mudar a cor de fundo conforme a temperatura*/
  const getBackgroundClass = () => {
    if (!weather) return "neutral";
    const temp = weather.main.temp;
    const desc = weather.weather[0].description.toLowerCase();

    if (desc.includes("chuva") || desc.includes("nublado")) return "rainy";
    if (temp >= 28) return "hot";
    if (temp <= 20) return "cold";
    return "mild";
  };

  /*Acrescenta o classname no body conforme qual cor o fundo vai receber*/
  document.body.className = getBackgroundClass();

  /*Parte visual do container*/
  return (
    <div id="container" className={getBackgroundClass()}>
      <div id="search_section">
        <h2>Verificar clima da cidade:</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
        />
        <button onClick={fetchWeather}>
          <img src="/lupa.png" width="18" alt="Buscar" />
        </button>
      </div>

      <div id="line"></div>

      <div id="weather_section">
        {error && <p>Cidade não encontrada, tente novamente</p>}

        {weather && (
          <>
            <h1>
              {weather.name}{" "}
              <img
                src={`https://flagsapi.com/${weather.sys.country}/flat/64.png`}
                width="30"
                alt="Bandeira"
              />
            </h1>
              <h1>{Math.round(weather.main.temp)}°C</h1>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Ícone do clima"
              />
              <p>{weather.weather[0].description}</p>
              <p><img src="umidade.png" width="15px"/> {weather.main.humidity}%</p>
              <p><img src="vento.png" width="15px"/> {Math.round(weather.wind.speed * 3.6)} km/h</p>
          </>
        )}

        {!weather && !error && <p>Pesquise uma cidade para ver o clima</p>}
      </div>
    </div>
  );
};

export default Container;
