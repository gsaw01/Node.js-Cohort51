import express from 'express';
import { keys } from './sources/keys.js';

export const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend to frontend!');
});

app.post('/weather', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) return res.status(400).json({ error: "cityName is required" });

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${keys.API_KEY}&units=metric`);
    const data = await response.json();

    if (data.cod !== 200) return res.json({ weatherText: 'City not found!' });

    const temperature = Math.floor(data.main.temp);
    res.json({ weatherText: `Temperature in ${cityName} is ${temperature}°C` });
  } catch (error) {
    res.status(500).json({ error: 'Server-side error.' });
  }
});