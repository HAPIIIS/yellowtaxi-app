const express = require("express");
const cors = require("cors");
const db = require("./db");
const axios = require('axios');

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Yellow Taxi API!");
});

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('https://data.cityofnewyork.us/resource/gkne-dk5s.json');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/trips', async (req, res) => {
  try {
      const trips = await db.any('SELECT * FROM trips');
      res.json(trips);
  } catch (error) {
      console.error('Error fetching trips data:', error);
      res.status(500).json({ error: 'Failed to fetch trips data' });
  }
});

app.get('/api/trips/filter', async (req, res) => {
  const { payment_type, min_fare, max_fare, distance, time_range } = req.query;
  let query = 'SELECT * FROM trips WHERE 1=1';
  let values = [];
  let index = 1; 

  if (payment_type) {
    query += ` AND payment_type = $${index}`;
    values.push(payment_type);
    index++;
  }
  if (min_fare) {
    query += ` AND fare_amount >= $${index}`;
    values.push(min_fare);
    index++;
  }
  if (max_fare) {
    query += ` AND fare_amount <= $${index}`;
    values.push(max_fare);
    index++;
  }
  if (distance) {
    if (distance === 'closest') {
      query += ` AND trip_distance < $${index}`;
      values.push(10); 
      index++;
    } else if (distance === 'furthest') {
      query += ` AND trip_distance >= $${index}`;
      values.push(10); 
      index++;
    }
  }
  if (time_range) {
    const [startTime, endTime] = time_range.split('-');
    if (startTime && endTime) {
      query += ` AND pickup_datetime BETWEEN $${index} AND $${index + 1}`;
      values.push(startTime, endTime);
      index += 2;
    }
  }

  try {
    const trips = await db.any(query, values);
    res.json(trips);
  } catch (error) {
    console.error('Error fetching filtered trips data:', error);
    res.status(500).json({ error: 'Failed to fetch filtered trips data' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
