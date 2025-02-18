import express from 'express';

const PORT = 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend to frontend!');
});

app.post('/weather', (req, res) => {
  const { cityName } = req.body;
  if (!cityName) return res.status(400).json({ error: "cityName is required" });
  res.json({ message: `City name you sent: ${cityName}` });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));